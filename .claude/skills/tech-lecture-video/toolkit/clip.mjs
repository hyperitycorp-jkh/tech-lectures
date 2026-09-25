// 결과물 영상을 장면 안에서 재생할 수 있게 PNG 시퀀스로 푼다.
//   node toolkit/clip.mjs <input.mp4|webm|mov> <out 폴더> [--fps 30] [--w 1080] [--start 0] [--duration 초]
// 장면에서는 CLIP.frame(name, f) 로 해당 프레임 이미지를 꺼내 쓴다 (templates/lib.js).
import { execFileSync } from 'node:child_process';
import { mkdir, rm, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [input, outDir] = process.argv.slice(2);
const opt = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i >= 0 ? process.argv[i + 1] : d; };
if (!input || !outDir) { console.error('usage: clip.mjs <input> <outDir> [--fps 30] [--w 1080] [--start 0] [--duration s]'); process.exit(1); }
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
const trim = [...(opt('start') ? ['-ss', opt('start')] : []), ...(opt('duration') ? ['-t', opt('duration')] : [])];
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...trim, '-i', input,
  '-vf', `fps=${opt('fps', 30)},scale=${opt('w', 1080)}:-2`, join(outDir, '%05d.png')]);
const count = (await readdir(outDir)).filter(f => f.endsWith('.png')).length;
// 장면이 프레임 수를 알 수 있게 메타 파일을 남긴다
await writeFile(join(outDir, 'clip.json'), JSON.stringify({ frames: count, fps: +opt('fps', 30) }));
console.log(`done → ${outDir} (${count} frames)`);
