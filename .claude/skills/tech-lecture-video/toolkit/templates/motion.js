// 모션 도우미 — 장면을 '싸 보이지 않게' 만드는 기본기. 전부 시간(초)만 받는 결정적 함수라 renderFrame 에서 그대로 쓴다.
// 장면에서 lib.js 다음에 <script src="/toolkit/templates/motion.js"></script>
//   spring(x)             0→1, 살짝 넘쳤다 돌아옴 (톡 튀는 등장)
//   splitWords(el)        글자를 단어 단위 가림막 span 으로 (한 번만)
//   revealWords(el, p, s) 단어마다 가림막 아래에서 솟아오름 (p: 챕터 경과 초, s: 시작 초)
//   highlight(el, p, s)   형광펜이 왼쪽에서 오른쪽으로 지나감 (CSS 에서 --hlw 를 배경 너비로)
//   counter(el, from, to, p, s, d, fmt)  숫자 카운트업
//   wipeCircle(el, q, x, y)  원형으로 펼쳐지며 등장 (q: 0→1, x·y: 중심 px)
//   drawLine(path, q)     SVG 선이 그려짐 (stroke-dash)
//   blobs(el, t)          움직이는 부드러운 색 덩어리 배경 (el 안의 .blob)
const spring = x => x <= 0 ? 0 : x >= 1.6 ? 1 : 1 - Math.exp(-6 * x) * Math.cos(11 * x);
const easeOut = x => 1 - Math.pow(1 - clamp(x), 4);

function splitWords(el) {
  if (el.dataset.split) return;
  el.dataset.split = 1;
  // 글자 노드만 쪼갠다 (안에 <span class="hl"> 같은 태그가 있어도 속성이 깨지지 않게)
  const walk = n => [...n.childNodes].forEach(ch => {
    if (ch.nodeType === 1) return walk(ch);
    if (ch.nodeType !== 3 || !ch.textContent.trim()) return;
    const frag = document.createDocumentFragment();
    ch.textContent.split(/(\s+)/).forEach(w => {
      if (!w) return;
      if (/^\s+$/.test(w)) return frag.appendChild(document.createTextNode(w));
      const o = document.createElement('span'), i = document.createElement('span');
      o.className = 'mw'; i.className = 'mwi'; i.textContent = w; o.appendChild(i); frag.appendChild(o);
    });
    ch.replaceWith(frag);
  });
  walk(el);
}
function revealWords(el, p, s = 0, stagger = .07, dur = .55) {
  splitWords(el);
  el.querySelectorAll('.mwi').forEach((w, k) => {
    const q = easeOut(prog(p, s + k * stagger, s + k * stagger + dur));
    w.style.transform = `translateY(${(1 - q) * 110}%) rotate(${(1 - q) * 6}deg)`;
    w.style.opacity = q > 0 ? 1 : 0;
  });
}
function highlight(el, p, s = 0, dur = .5) { el.style.setProperty('--hlw', `${easeOut(prog(p, s, s + dur)) * 100}%`); }
function counter(el, from, to, p, s = 0, d = 1, fmt = v => Math.round(v)) { el.textContent = fmt(from + (to - from) * easeOut(prog(p, s, s + d))); }
function wipeCircle(el, q, x, y) {
  const r = easeOut(q) * 2300;
  el.style.clipPath = q >= 1 ? 'none' : `circle(${r}px at ${x}px ${y}px)`;
}
function drawLine(path, q) {
  const L = path.getTotalLength(); path.style.strokeDasharray = L; path.style.strokeDashoffset = L * (1 - easeOut(q));
}
function blobs(el, t) {
  el.querySelectorAll('.blob').forEach((b, k) => {
    b.style.transform = `translate(${Math.sin(t * .35 + k * 2.1) * 120}px, ${Math.cos(t * .28 + k * 1.3) * 140}px) scale(${1 + .12 * Math.sin(t * .5 + k)})`;
  });
}
