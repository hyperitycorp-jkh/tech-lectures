// 스타일 쇼릴 렌더러
//   node reel.mjs          → 전체 8개 구간 렌더 + reel.mp4
//   node reel.mjs 03       → 03 구간만 렌더 (seg_03.mp4), 작업 중 확인용
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { extname, join, resolve } from 'node:path';

const STYLES = [
  ['01', 'motion', '모션그래픽', 'Canvas 2D'],
  ['02', 'watercolor', '수채화', 'p5.js'],
  ['03', '3d', '3D', 'Three.js'],
  ['04', 'shader', '셰이더', 'WebGL GLSL'],
  ['05', 'kinetic', '키네틱 타이포', 'HTML/CSS'],
  ['06', 'ui', '앱 UI 데모', 'React'],
  ['07', 'data', '데이터 애니메이션', 'D3'],
  ['08', 'pixel', '픽셀아트', 'Canvas 160×90'],
];
const FPS = 30, SEG = 6;
const only = process.argv[2];
const todo = only ? STYLES.filter(s => s[0] === only) : STYLES;

// file:// 에서는 ES module import가 막히므로 로컬 정적 서버로 서빙
const ROOT = resolve('.');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css' };
const server = createServer(async (req, res) => {
  if (req.url === '/favicon.ico') { res.writeHead(204); return res.end(); } // 404 콘솔 에러 방지
  try {
    const p = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(ROOT)) throw new Error('outside root');
    const body = await readFile(p);
    res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
}).listen(0);
const port = server.address().port;

// Playwright 캐시 Chromium이 있으면 쓰고, 없으면 시스템 Chrome
const exe = [
  `${homedir()}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(p => existsSync(p));
const browser = await chromium.launch({
  executablePath: exe,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

for (const [nn, slug, name, tool] of todo) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(`http://localhost:${port}/styles/${nn}-${slug}.html`);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  if (errors.length) throw new Error(`${nn}: ${errors.join(' | ')}`);

  // 공통 스타일 라벨 오버레이
  await page.evaluate(([nn, name, tool]) => {
    const el = document.createElement('div');
    el.innerHTML = `<b>${nn}</b>&nbsp;·&nbsp;${name}<span> — ${tool}</span>`;
    Object.assign(el.style, {
      position: 'fixed', left: '32px', bottom: '28px', zIndex: 9999, padding: '8px 14px',
      font: '600 20px "Apple SD Gothic Neo", sans-serif', color: '#fff',
      background: 'rgba(0,0,0,.55)', borderRadius: '8px', letterSpacing: '-.2px',
    });
    el.querySelector('span').style.cssText = 'font-weight:400;opacity:.75';
    document.body.appendChild(el);
  }, [nn, name, tool]);

  const dir = `frames/${nn}`;
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  for (let f = 0; f < FPS * SEG; f++) {
    await page.evaluate(n => window.renderFrame(n), f);
    await page.screenshot({ path: `${dir}/${String(f).padStart(4, '0')}.png` });
  }
  if (errors.length) throw new Error(`${nn}: ${errors.join(' | ')}`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${dir}/%04d.png`,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', `seg_${nn}.mp4`]);
  console.log(`seg_${nn}.mp4 (${name})`);
  await page.close();
}
await browser.close();
server.close();

if (!only) {
  // 오디오를 직접 합성해 WAV로 기록: 구간별로 다른 화음의 패드 + 컷마다 틱
  // (긴 aevalsrc 수식은 ffmpeg 필터 파서에서 깨져서 PCM을 직접 만든다)
  const roots = [220, 196, 174.61, 246.94, 261.63, 196, 220, 329.63];
  const SR = 48000, total = STYLES.length * SEG, n = SR * total;
  const wav = Buffer.alloc(44 + n * 2);
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + n * 2, 4); wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(SR, 24); wav.writeUInt32LE(SR * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write('data', 36); wav.writeUInt32LE(n * 2, 40);
  for (let s = 0; s < n; s++) {
    const t = s / SR, i = Math.min(Math.floor(t / SEG), roots.length - 1), lt = t - i * SEG, r = roots[i];
    const env = Math.min(1, lt / .4, (SEG - lt) / .4);
    let v = env * (.07 * Math.sin(2 * Math.PI * r * t) + .05 * Math.sin(2 * Math.PI * r * 1.25 * t) + .04 * Math.sin(2 * Math.PI * r * 1.5 * t));
    v += .22 * Math.sin(2 * Math.PI * 1320 * t) * Math.exp(-40 * lt);
    wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + s * 2);
  }
  await writeFile('reel_audio.wav', wav);
  const inputs = STYLES.flatMap(([nn]) => ['-i', `seg_${nn}.mp4`]);
  const concat = STYLES.map((_, i) => `[${i}:v]`).join('') + `concat=n=${STYLES.length}:v=1:a=0[v]`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs,
    '-i', 'reel_audio.wav',
    '-filter_complex', concat, '-map', '[v]', '-map', `${STYLES.length}:a`,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-c:a', 'aac', '-b:a', '160k', '-shortest', 'reel.mp4'],
    { stdio: 'inherit' });
  console.log('done → reel.mp4');
}
