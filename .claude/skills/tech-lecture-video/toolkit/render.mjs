// 코드 렌더 영상 렌더러 (레포 루트에서 실행)
//   node toolkit/render.mjs <scene.html> [--name 이름] [--still] [--query "slide=2"]
// 장면 파일 계약:
//   window.META = { W, H, FPS, DURATION, AUDIO?: 'calm'|'bright'|'beat'|'none', VOICE?: 'Yuna', VOICE_FILE?: '녹음.m4a' }
//   window.NARRATION = [{ t: 초, text: '문장' }]   ← 있으면 macOS say 나레이션 + SRT 자막 생성
//   window.renderFrame(f)  (async 가능) · window.READY = true
// 출력: <scene 폴더>/out/<name>.mp4 (+ .srt) · --still 이면 <name>.png (frame META.STILL_FRAME || 0)
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir, tmpdir } from 'node:os';
import { extname, join, resolve, dirname, relative, basename } from 'node:path';

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const VALUE_FLAGS = ['--name', '--query'];
const scenePath = resolve(args.find((a, i) => !a.startsWith('--') && !VALUE_FLAGS.includes(args[i - 1])) || '');
if (!scenePath.endsWith('.html')) { console.error('usage: node toolkit/render.mjs <scene.html> [--name x] [--still] [--query "k=v"]'); process.exit(1); }
const STILL = args.includes('--still');
const query = opt('query');
const name = opt('name') || basename(scenePath, '.html') + (query ? '-' + query.replace(/[^a-z0-9]+/gi, '') : '');

// 정적 서버 루트 = 현재 폴더(레포 루트). 장면에서 /toolkit/templates/lib.js 같은 절대 경로를 쓸 수 있다.
const ROOT = resolve('.');
if (!scenePath.startsWith(ROOT)) { console.error('scene must be inside the current folder (run from repo root)'); process.exit(1); }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  if (req.url === '/favicon.ico') { res.writeHead(204); return res.end(); }
  try {
    const p = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(ROOT)) throw new Error('outside root');
    const body = await readFile(p);
    res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
}).listen(0);
const url = `http://localhost:${server.address().port}/${relative(ROOT, scenePath).split('/').map(encodeURIComponent).join('/')}${query ? '?' + query : ''}`;

const exe = [
  `${homedir()}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(p => existsSync(p));
const browser = await chromium.launch({
  executablePath: exe,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

const errors = [];
const watch = page => {
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  page.on('response', r => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
};
const probe = await browser.newPage(); watch(probe);
await probe.goto(url);
await probe.waitForFunction(() => window.META, null, { timeout: 15000 });
const META = await probe.evaluate(() => window.META);
const NARRATION = await probe.evaluate(() => window.NARRATION || []);
await probe.close();

const page = await browser.newPage({ viewport: { width: META.W, height: META.H }, deviceScaleFactor: 1 }); watch(page);
await page.goto(url);
// READY 를 기다리는 동안 404·스크립트 에러가 나면 바로 알려준다 (타임아웃까지 기다리지 않음)
for (let waited = 0; !(await page.evaluate(() => window.READY === true)); waited += 100) {
  if (errors.length) throw new Error(`장면 로드 실패: ${errors.join(' | ')}`);
  if (waited > 30000) throw new Error('READY 30초 초과 — ready()/window.READY 호출 확인');
  await new Promise(r => setTimeout(r, 100));
}
await page.evaluate(() => document.fonts.ready);
if (errors.length) throw new Error(errors.join(' | '));

const sceneDir = dirname(scenePath), outDir = join(sceneDir, 'out');
await mkdir(outDir, { recursive: true });

if (STILL) {
  await page.evaluate(n => window.renderFrame(n), META.STILL_FRAME || 0);
  await page.screenshot({ path: join(outDir, `${name}.png`) });
  if (errors.length) throw new Error(errors.join(' | '));
  await browser.close(); server.close();
  console.log(`done → ${relative(ROOT, join(outDir, name + '.png'))}`);
  process.exit(0);
}

const framesDir = join(sceneDir, 'frames', name);
await rm(framesDir, { recursive: true, force: true });
await mkdir(framesDir, { recursive: true });
const total = Math.round(META.FPS * META.DURATION);
for (let f = 0; f < total; f++) {
  try { await page.evaluate(n => window.renderFrame(n), f); }
  catch (e) { throw new Error(`frame ${f} 렌더 실패: ${[...errors, e.message].join(' | ')}`); }
  await page.screenshot({ path: join(framesDir, `${String(f).padStart(5, '0')}.png`) });
  if (errors.length) throw new Error(`frame ${f}: ${errors.join(' | ')}`);
  if (f % 300 === 0) console.log(`${name} ${f}/${total}`);
}
await browser.close(); server.close();

// ── 배경음: 프리셋을 PCM으로 합성 ──
const SR = 48000, D = META.DURATION, n = Math.round(SR * D), TAU = Math.PI * 2;
const note = m => 440 * Math.pow(2, (m - 69) / 12);
const env = (t, a, r, len) => t < 0 || t > len ? 0 : Math.min(1, t / a) * Math.min(1, (len - t) / r);
const pad = (t, ns, amp) => ns.reduce((s, m) => s + Math.sin(TAU * note(m) * t) * amp + Math.sin(TAU * note(m) * 2.001 * t) * amp * .25, 0);
const bell = (t, m, amp) => t < 0 ? 0 : Math.sin(TAU * note(m) * t) * Math.exp(-t * 3.2) * amp;
let seed = 7; const noise = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 * 2 - 1; };
const PROG = [[48, 55, 60, 64], [45, 52, 57, 60], [53, 57, 60, 65], [50, 57, 62, 65]];
const PRESETS = {
  none: () => 0,
  calm: t => pad(t, PROG[Math.floor(t / 4) % 4], .016) * env(t, 1.5, 2, D),
  bright: t => {
    const c = PROG[Math.floor(t / 4) % 4], k = Math.floor(t / .5);
    return (pad(t, c, .016) + bell(t - k * .5, c[k % 4] + 12, .03)) * env(t, 1, 1.5, D);
  },
  beat: t => {
    const beat = 60 / 112, bt = t % beat, ht = (t + beat / 2) % beat;
    const kick = Math.sin(TAU * (50 + 90 * Math.exp(-bt * 30)) * bt) * Math.exp(-bt * 9) * .25;
    return (kick + noise() * Math.exp(-ht * 60) * .04 + pad(t, PROG[Math.floor(t / (beat * 8)) % 4], .018)) * env(t, .1, 1.5, D);
  },
};
const synth = PRESETS[META.AUDIO || 'calm'];
const wav = Buffer.alloc(44 + n * 2);
wav.write('RIFF', 0); wav.writeUInt32LE(36 + n * 2, 4); wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(SR, 24); wav.writeUInt32LE(SR * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
wav.write('data', 36); wav.writeUInt32LE(n * 2, 40);
for (let s = 0; s < n; s++) wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, synth(s / SR))) * 32767), 44 + s * 2);
const tmp = join(tmpdir(), `render-${process.pid}`);
await mkdir(tmp, { recursive: true });
const musicPath = join(tmp, 'music.wav');
await writeFile(musicPath, wav);

// ── 나레이션: 녹음 파일(VOICE_FILE) 또는 macOS say, 같은 타이밍으로 SRT ──
// ffmpeg 입력 순서: 0 = 프레임, 1 = 배경음, 2.. = 목소리
const audioInputs = ['-i', musicPath], filters = [];
const dur = p => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).toString());
const srtTime = s => { const ms = Math.round(s * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
let srt = '';
if (META.VOICE_FILE) {
  audioInputs.push('-i', join(sceneDir, META.VOICE_FILE));
  filters.push('[2:a]aresample=48000[v0]');
} else {
  NARRATION.forEach((line, i) => {
    const p = join(tmp, `n${i}.aiff`);
    execFileSync('say', ['-v', META.VOICE || 'Yuna', '-r', String(META.VOICE_RATE || 190), '-o', p, line.text]);
    audioInputs.push('-i', p);
    const ms = Math.round(line.t * 1000);
    filters.push(`[${i + 2}:a]aresample=48000,adelay=${ms}|${ms}[v${i}]`);
  });
}
NARRATION.forEach((line, i) => {
  const next = NARRATION[i + 1]?.t ?? D;
  if (!META.VOICE_FILE) {
    const len = dur(join(tmp, `n${i}.aiff`));
    if (line.t + len > next) console.warn(`⚠ 나레이션 ${i + 1}번이 ${(line.t + len - next).toFixed(1)}초 겹칩니다 — 다음 줄 t를 ${(line.t + len + .3).toFixed(1)} 이상으로`);
  }
  const end = META.VOICE_FILE ? next - .05 : Math.min(next - .05, line.t + dur(join(tmp, `n${i}.aiff`)) + .3);
  srt += `${i + 1}\n${srtTime(line.t)} --> ${srtTime(end)}\n${line.text}\n\n`;
});
const voices = filters.length;
const mix = voices
  ? `${filters.join(';')};[1:a]volume=${META.MUSIC_UNDER_VOICE ?? .35}[m];[m]${[...Array(voices).keys()].map(i => `[v${i}]`).join('')}amix=inputs=${voices + 1}:normalize=0:duration=first[a]`
  : '[1:a]anull[a]';
const outMp4 = join(outDir, `${name}.mp4`);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(META.FPS), '-i', join(framesDir, '%05d.png'), ...audioInputs,
  '-filter_complex', mix, '-map', '0:v', '-map', '[a]',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-c:a', 'aac', '-b:a', '192k', '-t', String(D), outMp4]);
if (srt) await writeFile(join(outDir, `${name}.srt`), srt);
await rm(tmp, { recursive: true, force: true });
console.log(`done → ${relative(ROOT, outMp4)}${srt ? ' (+ .srt)' : ''}`);
