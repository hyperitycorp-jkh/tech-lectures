// longform.script.js 의 나레이션을 render.mjs 와 같은 설정(say -v Yuna -r 190)으로 읽어 길이를 잰다
//   node lectures/001-opus55-video-quality/scenes/timing.mjs   → longform.timing.js
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const ctx = { window: {} };
vm.runInNewContext(await readFile(join(here, 'longform.script.js'), 'utf8'), ctx);
const { chapters, toSay } = ctx.window.SCRIPT;
const tmp = await mkdtemp(join(tmpdir(), 'timing-'));
const dur = p => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).toString());

const lens = chapters.map((c, ci) => c.say.map((text, li) => {
  const p = join(tmp, `${ci}-${li}.aiff`);
  execFileSync('say', ['-v', 'Yuna', '-r', '190', '-o', p, toSay(text)]);
  return +dur(p).toFixed(3);
}));
await rm(tmp, { recursive: true, force: true });
await writeFile(join(here, 'longform.timing.js'), `// timing.mjs 가 생성 — 챕터별 나레이션 줄 길이(초)\nwindow.TIMING = ${JSON.stringify(lens)};\n`);
const total = lens.flat().reduce((a, b) => a + b, 0);
console.log(`${lens.flat().length}줄, 음성 합계 ${total.toFixed(1)}초`);
