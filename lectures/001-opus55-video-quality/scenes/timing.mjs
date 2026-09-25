// <이름>.script.js 의 나레이션 음성을 만들고(toolkit/tts.mjs, 캐시 scenes/tts-cache) 길이·입 모양을 적는다
//   node lectures/001-opus55-video-quality/scenes/timing.mjs [longform|shorts]   → <이름>.timing.js (기본 longform)
// render.mjs 도 같은 설정·같은 캐시를 쓰므로 렌더 음성과 타이밍이 일치한다.
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { voice, envelope } from '../../../toolkit/tts.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const name = process.argv[2] || 'longform';
const ctx = { window: {} };
ctx.window.window = ctx.window;  // voice.js 가 window.X 로 정의 → 대본에서 전역처럼 참조
vm.createContext(ctx.window);
for (const f of ['voice.js', `${name}.script.js`]) vm.runInContext(await readFile(join(here, f), 'utf8'), ctx.window);
const { chapters, toSay, voice: meta } = ctx.window.SCRIPT;

const flat = chapters.flatMap((c, ci) => c.say.map((text, li) => ({ ci, li, say: toSay(text) })));
const t0 = Date.now();
const got = voice(flat.map(x => x.say), meta, join(here, 'tts-cache'));
const TIMING = chapters.map(c => c.say.map(() => 0)), ENV = chapters.map(c => c.say.map(() => ''));
flat.forEach((x, i) => {
  TIMING[x.ci][x.li] = +got[i].dur.toFixed(3);
  // 입 모양: 프레임당 한 글자 0~9
  ENV[x.ci][x.li] = envelope(got[i].path, 30).map(v => Math.round(v * 9)).join('');
});
await writeFile(join(here, `${name}.timing.js`),
  `// timing.mjs 가 생성 — 챕터별 나레이션 줄 길이(초)와 프레임별 음량(0~9, 아바타 입 모양)\nwindow.TIMING = ${JSON.stringify(TIMING)};\nwindow.ENV = ${JSON.stringify(ENV)};\n`);
const total = got.reduce((a, b) => a + b.dur, 0);
console.log(`${flat.length}줄, 음성 합계 ${total.toFixed(1)}초 (${((Date.now() - t0) / 1000).toFixed(0)}초 걸림)`);
