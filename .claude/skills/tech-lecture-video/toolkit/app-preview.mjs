// App Store 앱 미리보기 한 편을 만든다: preview.json → 샷별 클립 → 장면 렌더 → 스토어 규격 mp4 + 검수 시트
//   node toolkit/app-preview.mjs lectures/NNN/private/<앱>/preview.json [--encode-only]  (--encode-only: 렌더된 out/<name>.mp4 를 스토어 규격으로만 다시 변환)
// preview.json 은 toolkit/templates/app-preview.html 맨 위 주석 참고. shots[].src 는 json 기준 상대 경로(시뮬레이터 녹화 원본).
// 결과: <폴더>/out/<name>.mp4(렌더 원본) · <name>-appstore.mp4(886×1920·30fps·H.264 High 4.0·AAC 256k 스테레오) · <name>-sheet.jpg
import { execFileSync } from 'node:child_process';
import { mkdir, rm, readdir, writeFile, readFile, copyFile } from 'node:fs/promises';
import { dirname, join, resolve, relative } from 'node:path';

const jsonPath = resolve(process.argv[2] || ''), encodeOnly = process.argv.includes('--encode-only');
if (!jsonPath.endsWith('.json')) { console.error('usage: node toolkit/app-preview.mjs <preview.json>'); process.exit(1); }
const dir = dirname(jsonPath), C = JSON.parse(await readFile(jsonPath, 'utf8'));
const name = C.name || 'preview';
const total = C.shots.reduce((s, x) => s + x.dur, 0);
if (total < 15 || total > 30) { console.error(`길이 ${total.toFixed(2)}초 — 앱 미리보기는 15~30초`); process.exit(1); }

// 1) 샷마다 원본에서 구간을 잘라 886 폭 JPG 시퀀스로 (장면이 CLIP.show 로 읽는다)
if (!encodeOnly) for (const [i, s] of C.shots.entries()) {
  const out = join(dir, 'clips', `s${String(i + 1).padStart(2, '0')}`);
  await rm(out, { recursive: true, force: true }); await mkdir(out, { recursive: true });
  // 녹화본 끝을 넘지 않게: 모자라면 마지막 프레임에서 멈춘다(CLIP.show). 정지 화면(PNG·JPG 캡처)은 한 장을 dur 초 동안
  const still = /\.(png|jpe?g)$/i.test(s.src);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...(still ? ['-loop', '1', '-t', String(s.dur + .1)] : ['-ss', String(s.start || 0), '-t', String(s.dur + .1)]),
    '-i', join(dir, s.src), '-vf', 'fps=30,scale=886:-2', '-q:v', '2', join(out, '%05d.jpg')]);
  const frames = (await readdir(out)).filter(f => f.endsWith('.jpg')).length;
  if (!frames) throw new Error(`${s.src} ${s.start}s 부터 프레임이 없다`);
  await writeFile(join(out, 'clip.json'), JSON.stringify({ frames, fps: 30, ext: 'jpg' }));
}

// 2) 템플릿을 폴더에 두고 렌더 (render.mjs 는 레포 루트에서 돈다)
if (!encodeOnly) {
  await copyFile('toolkit/templates/app-preview.html', join(dir, 'preview.html'));
  execFileSync('node', ['toolkit/render.mjs', relative(resolve('.'), join(dir, 'preview.html')), '--name', name], { stdio: 'inherit' });
}

// 3) 스토어 규격으로 다시 인코딩 (애플: H.264 High 4.0, 10~12Mbps, AAC 256k 스테레오 48kHz, 30fps 이하)
//    평균 비트레이트만 주면 정지 화면이 많은 편은 2Mbps·음성 150k 로 모자라게 나온다 → 영상은 CBR(nal-hrd=cbr, 채움 데이터), 음성은 AudioToolbox CBR 256k
const src = join(dir, 'out', `${name}.mp4`), dst = join(dir, 'out', `${name}-appstore.mp4`);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src,
  '-c:v', 'libx264', '-profile:v', 'high', '-level:v', '4.0', '-pix_fmt', 'yuv420p', '-r', '30',
  '-b:v', '11M', '-minrate', '11M', '-maxrate', '11M', '-bufsize', '11M', '-x264-params', 'nal-hrd=cbr',
  '-c:a', 'aac_at', '-aac_at_mode', 'cbr', '-b:a', '256k', '-ac', '2', '-ar', '48000', '-movflags', '+faststart', dst]);

// 4) 검수: 규격 확인 + 샷 경계·가운데 프레임 콘택트 시트
const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', dst]).toString());
const v = probe.streams.find(x => x.codec_type === 'video'), a = probe.streams.find(x => x.codec_type === 'audio');
console.log(`${relative(resolve('.'), dst)}: ${v.width}×${v.height} ${v.r_frame_rate}fps ${v.profile} L${v.level} ${(v.bit_rate / 1e6).toFixed(1)}Mbps ${(+probe.format.duration).toFixed(2)}s · audio ${a?.codec_name} ${a?.channels}ch ${a?.sample_rate}Hz ${Math.round((a?.bit_rate || 0) / 1000)}k · ${(probe.format.size / 1e6).toFixed(1)}MB`);
const times = []; let t0 = 0;
for (const s of C.shots) { times.push(t0 + .15, t0 + s.dur / 2); t0 += s.dur; }
times.push(total - .6);
const tiles = join(dir, 'out', 'sheet'); await rm(tiles, { recursive: true, force: true }); await mkdir(tiles, { recursive: true });
for (const [i, t] of times.entries()) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', t.toFixed(2), '-i', dst, '-frames:v', '1', '-vf', 'scale=221:480', join(tiles, `${String(i).padStart(2, '0')}.jpg`)]);
const cols = Math.min(times.length, 7), rows = Math.ceil(times.length / cols);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '1', '-i', join(tiles, '%02d.jpg'), '-vf', `tile=${cols}x${rows}:padding=6:color=white`, '-frames:v', '1', join(dir, 'out', `${name}-sheet.jpg`)]);
console.log(`sheet → ${relative(resolve('.'), join(dir, 'out', `${name}-sheet.jpg`))}`);
