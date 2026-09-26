// 레퍼런스 영상 분석 — "이 느낌으로" 만들 때. 컷 전환 시점·컷 길이·템포를 재고, 컷마다 한 장씩 모아 격자로 만든다.
// 격자 이미지를 Claude 가 보고 스타일 명세(글꼴 크기·색·전환 방식·레이아웃)를 정리해 템플릿 값에 옮긴다.
//   node toolkit/reference.mjs <영상 파일> <출력 폴더> [--threshold 0.3] [--cols 6]
// 결과: <출력>/spec.json { duration, size, fps, cuts[], shots: { count, medianSec, minSec }, bpmGuess } · <출력>/cuts.png
// 영상은 직접 받은 로컬 파일만 (저작권: 분석용으로만 쓰고 배포하지 않는다)
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [input, outArg] = process.argv.slice(2);
const opt = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i >= 0 ? process.argv[i + 1] : d; };
if (!input || !outArg) { console.error('usage: node toolkit/reference.mjs <video> <outDir> [--threshold 0.3] [--cols 6]'); process.exit(1); }
const out = resolve(outArg); mkdirSync(out, { recursive: true });
const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate:format=duration', '-of', 'json', input]).toString());
const st = probe.streams[0], [fn, fd] = st.r_frame_rate.split('/').map(Number), duration = +probe.format.duration;

// 장면 전환: ffmpeg scene 점수가 threshold 를 넘는 프레임의 시각
const log = execFileSync('ffmpeg', ['-hide_banner', '-i', input, '-vf', `select='gt(scene,${opt('threshold', '0.3')})',showinfo`, '-an', '-f', 'null', '-'], { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 }).toString()
  + '';
let text = log;
try { text = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i "${input}" -vf "select='gt(scene,${opt('threshold', '0.3')})',showinfo" -an -f null - 2>&1`], { maxBuffer: 1 << 26 }).toString(); } catch (e) { text = e.stdout?.toString() || ''; }
const cuts = [0, ...[...text.matchAll(/pts_time:([\d.]+)/g)].map(m => +(+m[1]).toFixed(3))];
const shots = cuts.map((c, i) => (cuts[i + 1] ?? duration) - c).filter(s => s > 0.05);
const sorted = [...shots].sort((a, b) => a - b), median = sorted[Math.floor(sorted.length / 2)] || duration;
// 템포 추정: 중간 컷 길이를 한 박자(또는 두 박자)로 보고 80~160 BPM 안으로 맞춘다 — 참고값
let bpm = 60 / median; while (bpm < 80) bpm *= 2; while (bpm > 160) bpm /= 2;

// 컷마다 한 장 (컷 시작 + 0.1초)
const cols = +opt('cols', 6), w = 240, h = Math.round(w * st.height / st.width);
const pick = cuts.slice(0, 36);
pick.forEach((c, i) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(Math.min(c + 0.1, duration - 0.05)), '-i', input, '-frames:v', '1', '-vf', `scale=${w}:${h}`, join(out, `cut-${String(i).padStart(3, '0')}.png`)]));
const filter = pick.map((_, k) => `[${k}]null[s${k}]`).join(';') + ';' + pick.map((_, k) => `[s${k}]`).join('') +
  `xstack=inputs=${pick.length}:layout=${pick.map((_, k) => `${(k % cols) * w}_${Math.floor(k / cols) * h}`).join('|')}:fill=black`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...pick.flatMap((_, i) => ['-i', join(out, `cut-${String(i).padStart(3, '0')}.png`)]), '-filter_complex', pick.length > 1 ? filter : '[0]null', join(out, 'cuts.png')]);

const spec = { source: input, duration: +duration.toFixed(2), size: [st.width, st.height], fps: +(fn / fd).toFixed(2), cuts,
  shots: { count: shots.length, medianSec: +median.toFixed(2), minSec: +sorted[0]?.toFixed(2) }, bpmGuess: Math.round(bpm) };
writeFileSync(join(out, 'spec.json'), JSON.stringify(spec, null, 1));
console.log(`컷 ${shots.length}개 · 중간 컷 ${median.toFixed(2)}초 · 템포 추정 ${Math.round(bpm)} BPM`);
console.log(`done → ${join(out, 'spec.json')} · ${join(out, 'cuts.png')}`);
