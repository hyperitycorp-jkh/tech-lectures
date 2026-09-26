// 001 캐릭터 아바타 (SVG). mountAvatar(부모, {left, top, size}) 로 붙이고 매 프레임 avatarFrame(t, a, talking) 을 부른다.
//   a: 입 벌림 0~1 (나레이션 음량, timing.js 의 ENV), talking: 말하는 중이면 true
// 눈 깜빡임·들썩임은 시간으로만 계산한다(결정적). 롱폼 longform.html 안의 것과 같은 그림.
const AVATAR_SVG = `
<svg viewBox="0 0 260 260" width="100%" height="100%">
  <ellipse cx="130" cy="248" rx="72" ry="9" fill="rgba(0,0,0,.45)"/>
  <g class="avBody">
    <line x1="130" y1="44" x2="130" y2="20" stroke="#2a2930" stroke-width="5" stroke-linecap="round"/>
    <path d="M130 2 L136 14 L148 20 L136 26 L130 38 L124 26 L112 20 L124 14 Z" fill="#d97757"/>
    <path d="M130 42 C203 42 230 102 230 152 C230 212 186 242 130 242 C74 242 30 212 30 152 C30 102 57 42 130 42 Z" fill="#ffb38a"/>
    <ellipse cx="130" cy="196" rx="62" ry="36" fill="#ffc7a6"/>
    <path d="M50 132 C50 60 210 60 210 132" stroke="#2a2930" stroke-width="12" fill="none" stroke-linecap="round"/>
    <rect x="30" y="114" width="28" height="50" rx="13" fill="#2a2930"/>
    <rect x="202" y="114" width="28" height="50" rx="13" fill="#2a2930"/>
    <path d="M46 162 C54 200 80 210 100 208" stroke="#2a2930" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="102" cy="208" r="7" fill="#d97757"/>
    <g class="eyeL" transform="translate(100 140)"><ellipse rx="17" ry="20" fill="#fff"/><ellipse cy="3" rx="11" ry="13" fill="#1f1e1d"/><circle cx="-4" cy="-3" r="4.5" fill="#fff"/></g>
    <g class="eyeR" transform="translate(160 140)"><ellipse rx="17" ry="20" fill="#fff"/><ellipse cy="3" rx="11" ry="13" fill="#1f1e1d"/><circle cx="-4" cy="-3" r="4.5" fill="#fff"/></g>
    <ellipse cx="78" cy="174" rx="15" ry="8" fill="#ff7a7a" opacity=".45"/>
    <ellipse cx="182" cy="174" rx="15" ry="8" fill="#ff7a7a" opacity=".45"/>
    <g transform="translate(130 180)">
      <path class="mouthClosed" d="M-14 0 Q0 13 14 0" stroke="#3a2320" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g class="mouthOpen"><ellipse class="mo" rx="13" ry="8" fill="#3a2320"/><ellipse class="tongue" rx="8" ry="4" fill="#ff8a8a"/></g>
    </g>
  </g>
</svg>`;
let AV;
function mountAvatar(parent, { left, top, size }) {
  const el = document.createElement('div');
  Object.assign(el.style, { position: 'absolute', left: left + 'px', top: top + 'px', width: size + 'px', height: size + 'px' });
  el.innerHTML = AVATAR_SVG;
  parent.appendChild(el);
  const q = c => el.querySelector('.' + c);
  AV = { el, body: q('avBody'), eyes: [q('eyeL'), q('eyeR')], closed: q('mouthClosed'), open: q('mouthOpen'), mo: q('mo'), tongue: q('tongue') };
  return el;
}
function avatarFrame(t, a, talking) {
  const open = a > .12;
  AV.closed.style.display = open ? 'none' : '';
  AV.open.style.display = open ? '' : 'none';
  AV.mo.setAttribute('rx', 12 + a * 5); AV.mo.setAttribute('ry', 3 + a * 15);
  AV.tongue.setAttribute('cy', 1 + a * 8); AV.tongue.setAttribute('ry', 2 + a * 5);
  const cyc = t % 3.7, blink = cyc > 3.55 || (Math.floor(t / 3.7) % 3 === 1 && cyc > 3.3 && cyc < 3.42);
  AV.eyes.forEach((e, k) => e.setAttribute('transform', `translate(${k ? 160 : 100} 140) scale(1 ${blink ? .1 : 1})`));
  AV.body.setAttribute('transform',
    `translate(0 ${(-7 * a - 2 * Math.sin(t * 2.4)).toFixed(2)}) rotate(${((talking ? 1 : 0) * 2.5 * Math.sin(t * 3.1)).toFixed(2)} 130 240)`);
}
