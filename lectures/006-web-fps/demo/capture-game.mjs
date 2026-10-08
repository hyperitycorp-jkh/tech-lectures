// 게임 플레이 장면을 끊김 없이 녹화한다 — 페이지의 시간(requestAnimationFrame·performance.now)을 가상 시간으로 바꿔
// 한 프레임씩 진행하고 찍는다. 렌더가 느려도 결과는 정확히 30fps. 게임은 개발 서버(?shot= 장면 바로 가기가 켜진 빌드)에서 돈다.
//   GAME_SRC=<게임 레포 절대 경로> node lectures/006-web-fps/demo/capture-game.mjs --base http://127.0.0.1:5299/ --map pangyo --pilot --seconds 20 --out lectures/006-web-fps/scenes/clips/fp-pangyo
// 게임 레포는 비공개다. 이 스크립트는 게임의 개발용 훅(window.__gp·__match·__mission, ?shot=)에 기대므로 그 게임에서만 돈다 — 방법을 보여 주는 예시
// 모드
//   --pilot   내 병사를 봇 두뇌가 조종하고, 카메라는 1인칭으로 그 시선을 부드럽게 따라간다
//   --aerial  자유 카메라로 맵 위를 천천히 돈다(글자·버튼 숨김)
//   --shot <장면>  게임의 ?shot= 장면(drone·fo·lobby·title …)을 띄운 뒤 그대로 녹화
// 결과: <out>/00001.jpg … + clip.json (장면 템플릿의 CLIP.show 가 읽는다)
import { chromium } from '../../../node_modules/playwright-core/index.mjs';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i >= 0 ? process.argv[i + 1] : d; };
const has = k => process.argv.includes(`--${k}`);
const BASE = arg('base', 'http://127.0.0.1:5299/'), MAP = arg('map', 'pangyo'), MODE = arg('mode', 'tdm');
const W = +arg('w', 1920), H = +arg('h', 1080), FPS = +arg('fps', 30), SECS = +arg('seconds', 10), WARM = +arg('warm', 4);
const OUT = arg('out'), SHOT = arg('shot'), DPR = +arg('dpr', 1), MOBILE = has('mobile');
if (!OUT) { console.error('--out 폴더가 필요하다'); process.exit(1); }

// 가상 시간: start() 전에는 실제 시간 그대로(불러오기·준비), 뒤로는 step(ms) 할 때만 시간이 흐르고 rAF 가 돈다
const VT = () => {
  const realRAF = window.requestAnimationFrame.bind(window), realCancel = window.cancelAnimationFrame.bind(window);
  const realNow = performance.now.bind(performance), realDate = Date.now;
  let on = false, now = 0, base = 0, dateBase = 0, id = 1e6;
  const cbs = new Map();
  performance.now = () => (on ? now : realNow());
  Date.now = () => (on ? Math.round(dateBase + (now - base)) : realDate());
  window.requestAnimationFrame = cb => { if (!on) return realRAF(cb); const i = ++id; cbs.set(i, cb); return i; };
  window.cancelAnimationFrame = i => { if (cbs.has(i)) cbs.delete(i); else realCancel(i); };
  window.__vt = {
    start() { now = base = realNow(); dateBase = realDate(); on = true; },
    step(ms) {
      now += ms;
      const list = [...cbs.values()]; cbs.clear();
      for (const cb of list) { try { cb(now); } catch (e) { console.error('[vt]', e); } }
    },
  };
};

const exe = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR, isMobile: MOBILE, hasTouch: MOBILE, locale: 'ko-KR' });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('[pageerror]', e.message.slice(0, 160)));
await page.addInitScript(VT);
const ready = () => page.waitForFunction(() => window.__gpShot === 'ready' || /^(error|unknown)/.test(window.__gpShot || ''), null, { timeout: 120000 });

if (SHOT) {
  await page.goto(`${BASE}?shot=${SHOT}${MAP ? `&map=${MAP}` : ''}`, { waitUntil: 'load' });
  await ready();
} else {
  // 가벼운 장면으로 앱을 띄운 뒤 원하는 맵·모드로 경기를 연다
  await page.goto(`${BASE}?shot=shop`, { waitUntil: 'load' });
  await ready();
  // 판 수를 채워 첫 판 안내 카드를 건너뛰고 병과를 연다(--class 로 병과 지정)
  await page.evaluate(([mode, map, cls]) => {
    const app = window.__gp;
    app.store.set('progress', { ...app.store.get('progress', {}), played: 20 });
    if (cls) app.store.set('fps.class', cls);
    void app.go('mission', { mode, map });
  }, [MODE, MAP, arg('class', '')]);
  await page.waitForFunction(() => window.__match && document.querySelector('.hud') && !document.querySelector('.screen-mission .loading, .gp-progress:not(.out)'), null, { timeout: 120000, polling: 300 });
  await page.waitForTimeout(500);
  await page.evaluate(() => { document.querySelector('.pause .go')?.click(); document.querySelector('.pause')?.classList.add('hidden'); });
}
// 병과 첫 판 안내 카드(.cp-tip)는 늘 숨긴다 — 처음 하는 사람용 도움말이라 영상에는 군더더기
await page.addStyleTag({ content: '.cp-tip { display: none !important; }' });
console.log('준비됨 —', await page.evaluate(() => `맵 ${window.__match?.map?.id ?? '-'} · 병사 ${window.__match?.fighters?.length ?? '-'}`));

if (has('pilot')) {
  // 내 병사(0번)에게 봇 두뇌를 붙이고, 사람 입력 대신 두뇌가 조종하게 한다
  await page.evaluate(async snapRoot => {
    const ai = await import(`/@fs${snapRoot}/kits/fps/src/sim/ai.ts`);
    const m = window.__match, s = window.__mission.session;
    window.__pilot = { ai, camYaw: m.fighters[0].yaw, camPitch: 0 };
    s.tick = dt => { let left = dt; while (left > 1e-6) { const h = Math.min(1 / 60, left); m.step(h, {}); left -= h; } return m.drain(); };
  }, arg('src', process.env.GAME_SRC || ''));
}
if (has('aerial') || has('topdown') || has('hidehud')) await page.addStyleTag({ content: '#gp-overlay, .gp-screen, .gp-modal, .mm-pill, .gp-toast, .hud, .pause { visibility: hidden !important; }' });
if (has('aerial') || has('topdown')) await page.evaluate(() => {
  // 자유 카메라 + 안개 끄기(멀리서 맵 전체가 보이게)
  const st = window.__mission.stage;
  window.__mission.dbg.freeCam = true;
  st.scene.fog = null;
  st.camera.far = 2000; st.camera.updateProjectionMatrix();
});
// 병과 능력 쓰기 등: --keys "KeyQ@0.8,KeyG@1.4" (초 단위, 실제 시간으로 경기 시작 뒤), --hold KeyW (녹화 내내 누름)
if (arg('class')) await page.evaluate(cls => { window.__mission.session.requestClass?.(cls); }, arg('class'));
for (const kv of (arg('keys', '') || '').split(',').filter(Boolean)) {
  const [code, at] = kv.split('@');
  await page.waitForTimeout(+at * 1000);
  await page.evaluate(code => { window.dispatchEvent(new KeyboardEvent('keydown', { code })); setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { code })), 120); }, code);
}
if (arg('hold')) await page.evaluate(code => window.dispatchEvent(new KeyboardEvent('keydown', { code })), arg('hold'));

// 매 프레임 전에: 조종(두뇌 다시 붙이기·시선 따라가기) / 공중 카메라
const before = (fi, total) => page.evaluate(([fi, total, aerial]) => {
  const m = window.__match;
  if (!m || !window.__mission) return;  // 경기 화면이 아닐 때(로비·타이틀)
  if (window.__pilot) {
    const P = window.__pilot, me = m.fighters[0];
    if (me.alive && !me.brain) me.brain = P.ai.newBrain({ ...me.body.pos }, me.yaw, 'hunt');
    const d = Math.atan2(Math.sin(me.yaw - P.camYaw), Math.cos(me.yaw - P.camYaw));
    P.camYaw += d * 0.22; P.camPitch += ((me.pitch ?? 0) - P.camPitch) * 0.22;
    window.__mission.look(P.camYaw, P.camPitch);
  }
  const cam = window.__mission.stage.camera, half = m.map?.half ?? 60, q = fi / Math.max(1, total);
  if (aerial === 'orbit') {
    // 맵 바깥 높은 곳에서 가운데를 보며 천천히 돈다(드론 촬영처럼)
    const a = +(window.__aerialFrom ?? 0.2) + q * 0.3, r = half * (2.1 - q * 0.45);
    cam.up.set(0, 1, 0);
    cam.position.set(Math.sin(a) * r, half * (1.7 - q * 0.45), Math.cos(a) * r);
    cam.lookAt(0, 0, 0);
  } else if (aerial === 'top') {
    // 바로 위에서 내려다본다(북쪽이 위): 지도와 나란히 비교용. 천천히 내려온다
    cam.up.set(0, 0, -1);
    cam.position.set(0, half * 1.75 - q * half * 0.2, 0.01);
    cam.lookAt(0, 0, 0);
  }
}, [fi, total, has('aerial') ? 'orbit' : has('topdown') ? 'top' : '']);

// 실제 시간으로 잠깐 흘려 교전이 붙게 한 뒤 녹화
for (let k = 0; k < WARM * 10; k++) { await before(0, 1); await page.waitForTimeout(100); }
await rm(OUT, { recursive: true, force: true }); await mkdir(OUT, { recursive: true });
await page.evaluate(() => window.__vt.start());
const total = Math.round(SECS * FPS), t0 = Date.now();
for (let f = 0; f < total; f++) {
  await before(f, total);
  await page.evaluate(ms => window.__vt.step(ms), 1000 / FPS);
  await page.screenshot({ path: join(OUT, `${String(f + 1).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 90 });
  if (f % 60 === 59) process.stdout.write(`${f + 1}/${total} `);
}
await writeFile(join(OUT, 'clip.json'), JSON.stringify({ frames: total, fps: FPS, ext: 'jpg' }));
console.log(`\n${total}프레임 ${((Date.now() - t0) / 1000).toFixed(0)}초 → ${OUT}`);
await browser.close();
