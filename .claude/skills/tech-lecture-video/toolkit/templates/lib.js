// 장면 공통 도우미. 장면에서 <script src="/toolkit/templates/lib.js"></script> 로 불러온다.
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const prog = (t, s, e) => clamp((t - s) / (e - s));
const ease = x => 1 - Math.pow(1 - x, 3);
const back = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
// 구간 [s, e] 안에서 d초 동안 들어오고 d초 동안 나가는 불투명도
const inOut = (t, s, e, d = .4) => Math.min(ease(prog(t, s, s + d)), 1 - ease(prog(t, e - d, e)));
const $ = id => document.getElementById(id);
function show(el, a, dy = 0, scale = 1, extra = '') {
  el.style.opacity = a; el.style.visibility = a > 0 ? 'visible' : 'hidden';
  el.style.transform = `translateY(${dy}px) scale(${scale}) ${extra}`;
}
// 현재 시각에 해당하는 항목 (배열은 t 오름차순)
const at = (list, t) => list.filter(x => x.t <= t).pop();

// 결과 영상 재생: toolkit/clip.mjs 로 푼 PNG 시퀀스를 프레임 번호로 교체한다
const CLIP = {
  meta: {},
  async load(dir) { if (!this.meta[dir]) this.meta[dir] = await (await fetch(`${dir}/clip.json`)).json(); return this.meta[dir]; },
  // local: 클립 시작 후 경과 프레임. 끝나면 마지막 프레임에서 멈춘다
  async show(img, dir, local) {
    const m = await this.load(dir);
    const idx = Math.min(m.frames, Math.max(1, local + 1));
    const src = `${dir}/${String(idx).padStart(5, '0')}.png`;
    if (img.getAttribute('src') !== src) { img.src = src; await img.decode(); }
  },
};

// 폰트·이미지 로드가 끝나면 첫 프레임을 그리고 READY
function ready(fonts = ['800 60px Pretendard']) {
  Promise.all([...fonts.map(f => document.fonts.load(f)), ...[...document.images].filter(i => i.src).map(i => i.decode())])
    .then(() => window.renderFrame(0)).then(() => { window.READY = true; });
}
