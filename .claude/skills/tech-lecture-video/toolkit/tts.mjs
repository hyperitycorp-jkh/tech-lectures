// 나레이션 음성 생성 + 캐시. render.mjs 와 강의별 타이밍 스크립트가 같이 쓴다.
//   META.VOICE_ENGINE: 'say'(기본, macOS) | 'qwen'(Qwen3-TTS 로컬, 설치: sh toolkit/tts/setup.sh)
//   say : VOICE(기본 Yuna) · VOICE_RATE(190)
//   qwen: VOICE(기본 Sohee) · VOICE_INSTRUCT(톤 지시문) · VOICE_SPEED(1.0) · VOICE_MODEL
// 캐시: <cacheDir>/<hash>.(aiff|wav), hash = 엔진·설정·문장. Qwen 은 매번 조금씩 다르게 읽으므로
// 캐시가 있어야 타이밍과 렌더 음성이 같다. 문장을 고친 줄만 새로 만든다.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

const ENGINES = {
  say: {
    ext: 'aiff',
    settings: m => ({ voice: m.VOICE || 'Yuna', rate: m.VOICE_RATE || 190 }),
    make(jobs, s) { for (const j of jobs) execFileSync('say', ['-v', s.voice, '-r', String(s.rate), '-o', j.out, j.text]); },
  },
  qwen: {
    ext: 'wav',
    settings: m => ({ model: m.VOICE_MODEL || 'mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit', voice: m.VOICE || 'Sohee',
      instruct: m.VOICE_INSTRUCT || '', speed: m.VOICE_SPEED || 1, lang: 'korean' }),
    make(jobs, s) {
      const py = process.env.QWEN_PY || join(homedir(), '.local/share/qwen-tts/v/bin/python');
      if (!existsSync(py)) throw new Error(`Qwen 실행환경이 없습니다 (${py}) — sh toolkit/tts/setup.sh`);
      const f = join(tmpdir(), `qwen-jobs-${process.pid}.json`);
      writeFileSync(f, JSON.stringify({ ...s, jobs }));
      execFileSync(py, [join(HERE, 'tts/qwen.py'), f], { stdio: ['ignore', 'inherit', 'ignore'] });
      rmSync(f, { force: true });
    },
  },
};

export const duration = p => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).toString());

// texts: 읽을 문장 배열 → [{ path, dur }] (같은 순서)
export function voice(texts, meta, cacheDir) {
  const name = meta.VOICE_ENGINE || 'say', eng = ENGINES[name];
  if (!eng) throw new Error(`알 수 없는 VOICE_ENGINE: ${name} (${Object.keys(ENGINES).join('|')})`);
  const s = eng.settings(meta);
  mkdirSync(cacheDir, { recursive: true });
  const items = texts.map(text => {
    const hash = createHash('sha1').update(JSON.stringify([name, s, text])).digest('hex').slice(0, 16);
    return { text, out: join(cacheDir, `${hash}.${eng.ext}`) };
  });
  const missing = items.filter(j => !existsSync(j.out));
  if (missing.length) {
    console.log(`음성 생성 ${missing.length}/${items.length}줄 (${name}, 나머지는 캐시)`);
    eng.make(missing, s);
  }
  return items.map(j => ({ path: j.out, dur: duration(j.out) }));
}

// 프레임별 음량(0~1, 0.98 분위수로 정규화) — 아바타 입 모양용
export function envelope(path, fps = 30) {
  const SR = 24000, pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', path, '-ac', '1', '-ar', String(SR), '-f', 's16le', '-'], { maxBuffer: 1 << 28 });
  const per = Math.round(SR / fps), n = Math.floor(pcm.length / 2 / per), out = [];
  for (let k = 0; k < n; k++) {
    let sum = 0;
    for (let i = 0; i < per; i++) { const v = pcm.readInt16LE((k * per + i) * 2) / 32768; sum += v * v; }
    out.push(Math.sqrt(sum / per));
  }
  const ref = [...out].sort((a, b) => a - b)[Math.floor(out.length * .98)] || 1;
  return out.map(v => Math.min(1, v / ref));
}
