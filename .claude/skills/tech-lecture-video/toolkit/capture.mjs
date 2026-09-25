// 자료화면·결과화면 수집
//   node toolkit/capture.mjs shot   <url> <out.png>  [--w 1920] [--h 1080] [--full] [--wait 1500]
//   node toolkit/capture.mjs record <url> <out.webm> [--w 1920] [--h 1080] [--seconds 8] [--scroll]
// shot: 참고 페이지·공식 문서·GitHub·데모 결과 스크린샷. record: 데모 웹앱 실행 화면 녹화(--scroll 이면 천천히 스크롤).
// 남의 페이지는 출처를 화면에 표기하고, 글을 길게 옮기지 않는다.
import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';
import { rename, rm, mkdir } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const [mode, url, out] = process.argv.slice(2);
const opt = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i >= 0 ? process.argv[i + 1] : d; };
if (!['shot', 'record'].includes(mode) || !url || !out) {
  console.error('usage: capture.mjs shot|record <url> <out> [--w --h --full --wait --seconds --scroll]'); process.exit(1);
}
const W = +opt('w', 1920), H = +opt('h', 1080);
const exe = [
  `${homedir()}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(p => existsSync(p));
const browser = await chromium.launch({ executablePath: exe });
await mkdir(dirname(resolve(out)), { recursive: true });

if (mode === 'shot') {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(+opt('wait', 1500));
  await page.screenshot({ path: out, fullPage: process.argv.includes('--full') });
} else {
  const vdir = join(tmpdir(), `rec-${process.pid}`);
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: vdir, size: { width: W, height: H } } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  const secs = +opt('seconds', 8);
  if (process.argv.includes('--scroll')) {
    const steps = secs * 10;
    for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(100); }
  } else await page.waitForTimeout(secs * 1000);
  const video = page.video();
  await ctx.close();
  await rename(await video.path(), out);
  await rm(vdir, { recursive: true, force: true });
}
await browser.close();
console.log(`done → ${out}`);
