// 003 앱 광고 4편(세로)에서 '드롭 3마디'씩 잘라 한 편으로 잇는다 → ads4.html 이 프레임·음악을 읽는다
//   준비: 003 광고 4편을 먼저 렌더 (lectures/003-mad-movie/scenes/out/<이름>-mad-v.mp4)
//   node lectures/008-prescription-remake/demo/build-ads4.mjs
// 128 BPM: 1박 0.46875초, 1마디 1.875초. 광고마다 1마디 인트로 → 2마디 라이저 → 3마디부터 드롭(MAD.drop=8박)
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const BAR = 4 * 60 / 128, OUT3 = 'lectures/003-mad-movie/scenes/out', SC = 'lectures/008-prescription-remake/scenes';
const ADS = [['runner', '러닝 앱 광고'], ['blurry', '소개팅 앱 광고'], ['morning', '알람 앱 광고'], ['memory', '사진 일기 앱 광고']];
const src = n => join(OUT3, `${n}-mad-v.mp4`);
// 조각: [영상, 시작(초), 길이(초), 라벨] — 첫 마디는 첫 광고의 라이저(2마디), 끝 마디는 마지막 광고의 아웃트로(8마디)
const parts = [[src(ADS[0][0]), BAR, BAR, null], ...ADS.map(([n, l]) => [src(n), 2 * BAR, 3 * BAR, l]), [src(ADS[3][0]), 7 * BAR, BAR, null]];
const tmp = join(SC, 'out', 'ads4-parts'); rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
parts.forEach(([f, s, d], i) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', s.toFixed(4), '-i', f, '-t', d.toFixed(4),
  '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-r', '30', '-c:a', 'pcm_s16le', '-ar', '48000', join(tmp, `p${i}.mkv`)]));
writeFileSync(join(tmp, 'list.txt'), parts.map((_, i) => `file 'p${i}.mkv'`).join('\n'));
const joined = join(tmp, 'joined.mkv');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(tmp, 'list.txt'), '-c', 'copy', joined]);
// 음악(장면이 MUSIC_FILE 로 읽음) + 프레임(장면이 CLIP.show 로 읽음)
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', joined, '-vn', '-c:a', 'aac', '-b:a', '256k', join(SC, 'ads4.m4a')]);
execFileSync('node', ['toolkit/clip.mjs', joined, join(SC, 'clips', 'ads4'), '--w', '1080', '--ext', 'jpg']);
let t = BAR; const SEG = ADS.map(([, l]) => { const s = { label: l, t: +t.toFixed(4), dur: +(3 * BAR).toFixed(4) }; t += 3 * BAR; return s; });
const DUR = +(t + BAR).toFixed(4);
writeFileSync(join(SC, 'ads4.timing.js'), `// build-ads4.mjs 가 생성\nwindow.CLIPDIR = '/${SC}/clips/ads4';\nwindow.SEG = ${JSON.stringify(SEG)};\nwindow.DUR = ${DUR};\n`);
console.log(`${parts.length}조각 → ${DUR}초`);
