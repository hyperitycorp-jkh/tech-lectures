// 스토리보드 — 전체 렌더 전에 핵심 장면 정지 이미지를 한 장으로 모아 방향을 확인한다 (몇 초).
//   node toolkit/storyboard.mjs <scene.html> --frames 10,60,130,300 [--query "s=1"] [--cols 5] [--width 320]
//   node toolkit/storyboard.mjs <scene.html> --every 1.5        ← 1.5초마다 (META.DURATION 끝까지)
// 결과: <scene 폴더>/out/<이름>-storyboard.png  (칸마다 초 표시)
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const scene = resolve(args[0] || '');
if (!scene.endsWith('.html')) { console.error('usage: node toolkit/storyboard.mjs <scene.html> --frames 10,60 | --every 초 [--query k=v] [--cols 5] [--width 320]'); process.exit(1); }
const cols = +(opt('cols') || 5), width = +(opt('width') || 320), query = opt('query');

// 장면 길이를 알아야 --every 를 쓸 수 있어서 META 만 먼저 읽는다
async function meta() {
  const b = await chromium.launch({ executablePath: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync) });
  const { createServer } = await import('node:http'); const { readFile } = await import('node:fs/promises');
  const root = resolve('.');
  const srv = createServer(async (q, r) => { try { r.end(await readFile(join(root, decodeURIComponent(new URL(q.url, 'http://x').pathname)))); } catch { r.writeHead(404); r.end(); } }).listen(0);
  const p = await b.newPage(); await p.goto(`http://localhost:${srv.address().port}/${scene.slice(root.length + 1)}${query ? '?' + query : ''}`);
  await p.waitForFunction(() => window.META, null, { timeout: 15000 });
  const m = await p.evaluate(() => window.META); await b.close(); srv.close(); return m;
}
const M = await meta();
const frames = opt('frames') ? opt('frames').split(',').map(Number)
  : [...Array(Math.floor(M.DURATION / +(opt('every') || 1.5))).keys()].map(k => Math.round(k * +(opt('every') || 1.5) * M.FPS));
const name = basename(scene, '.html'), outDir = join(dirname(scene), 'out'), tmp = join(outDir, `.sb-${name}`);
rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
for (const f of frames) {
  execFileSync('node', [join(dirname(new URL(import.meta.url).pathname), 'render.mjs'), scene, '--still', '--query', `${query ? query + '&' : ''}f=${f}`, '--name', `.sb-${name}/${String(f).padStart(5, '0')}`], { stdio: 'ignore' });
}
// 칸마다 시각을 찍어 격자로 (drawtext 가 없는 ffmpeg 도 있어서 시각은 파일 이름 순서로만 — 콘솔에 표로 남긴다)
const inputs = frames.flatMap(f => ['-i', join(tmp, `${String(f).padStart(5, '0')}.png`)]);
const h = Math.round(width * M.H / M.W), n = frames.length;
const filter = frames.map((_, k) => `[${k}]scale=${width}:${h}[s${k}]`).join(';') + ';' + frames.map((_, k) => `[s${k}]`).join('') +
  `xstack=inputs=${n}:layout=${frames.map((_, k) => `${(k % cols) * width}_${Math.floor(k / cols) * h}`).join('|')}:fill=black`;
const out = join(outDir, `${name}${query ? '-' + query.replace(/[^a-z0-9]+/gi, '') : ''}-storyboard.png`);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', n > 1 ? filter : `[0]scale=${width}:${h}`, out]);
rmSync(tmp, { recursive: true, force: true });
console.log(frames.map((f, k) => `${k + 1}: ${(f / M.FPS).toFixed(2)}s`).join('  '));
console.log(`done → ${out}`);
