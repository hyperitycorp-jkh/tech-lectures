// 헤드리스 Chromium으로 scene.html을 프레임 단위로 렌더 → frames/*.png → ffmpeg로 MP4
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

const exe = `${homedir()}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
rmSync('frames', { recursive: true, force: true });
mkdirSync('frames');

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('file://' + resolve('scene.html'));
await page.evaluate(() => document.fonts.ready);
const { FPS, DURATION } = await page.evaluate(() => window.META);
const total = FPS * DURATION;

for (let f = 0; f < total; f++) {
  const b64 = await page.evaluate(n => window.renderFrame(n), f);
  writeFileSync(`frames/${String(f).padStart(4, '0')}.png`, Buffer.from(b64, 'base64'));
  if (f % 60 === 0) console.log(`frame ${f}/${total}`);
}
await browser.close();

// 오디오: 코드로 합성한 패드 + 씬 전환마다 '틱' 효과음
const hits = [0.5, 2.7, 5.5, 8.8, 10.2];
const tick = hits.map(s => `0.25*sin(2*PI*1320*t)*exp(-40*(t-${s}))*gte(t,${s})`).join('+');
const pad = `0.08*sin(2*PI*220*t)+0.06*sin(2*PI*277.18*t)+0.05*sin(2*PI*329.63*t)+0.03*sin(2*PI*440*t*(1+0.002*sin(2*PI*0.3*t)))`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error',
  '-framerate', String(FPS), '-i', 'frames/%04d.png',
  '-f', 'lavfi', '-i', `aevalsrc='(${pad})*min(1,t/1.5)*min(1,(${DURATION}-t)/1.2)+${tick}':s=48000:d=${DURATION}`,
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18',
  '-c:a', 'aac', '-b:a', '160k', '-shortest', 'output.mp4'], { stdio: 'inherit' });
console.log('done → output.mp4');
