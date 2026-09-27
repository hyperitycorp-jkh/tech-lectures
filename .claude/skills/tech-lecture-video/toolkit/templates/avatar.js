// 바이브코더 캐릭터 — 비글 강아지 (SVG). 채널 프로필(강아지)과 맞춘 오리지널 캐릭터 (2026-09-27 사용자 선택 B · 스누피 복제 아님)
// mountAvatar(부모, {left, top, size}) 로 붙이고 매 프레임 avatarFrame(t, a, talking) 을 부른다.
//   a: 입 벌림 0~1 (나레이션 음량, timing.js 의 ENV), talking: 말하는 중이면 true
// 눈 깜빡임·들썩임은 시간으로만 계산한다(결정적). 정지 그림은 avatar.svg (썸네일·캐러셀용)
const AV_INK = '#26232b';
const AVATAR_SVG = `
<svg viewBox="0 0 260 260" width="100%" height="100%">
  <ellipse cx="130" cy="249" rx="70" ry="9" fill="rgba(0,0,0,.4)"/>
  <g class="avBody">
    <path d="M130 52 C200 52 226 104 226 152 C226 208 186 238 130 238 C74 238 34 208 34 152 C34 104 60 52 130 52 Z" fill="#fff" stroke="${AV_INK}" stroke-width="6"/>
    <path d="M147 108 C175 102 193 121 191 147 C189 167 169 171 155 161 C141 149 135 117 147 108 Z" fill="#8a5530" opacity=".92"/>
    <ellipse cx="130" cy="180" rx="46" ry="33" fill="#fbf3e6"/>
    <g class="earL"><path d="M66 58 C28 62 12 130 22 190 C28 222 62 226 74 200 C88 162 92 104 88 72 Z" fill="#8a5530" stroke="${AV_INK}" stroke-width="5" stroke-linejoin="round"/></g>
    <g class="earR"><path d="M194 58 C232 62 248 130 238 190 C232 222 198 226 186 200 C172 162 168 104 172 72 Z" fill="#8a5530" stroke="${AV_INK}" stroke-width="5" stroke-linejoin="round"/></g>
    <g class="eyeL" transform="translate(100 140)"><ellipse rx="9.5" ry="12.5" fill="${AV_INK}"/><circle cx="-3" cy="-5" r="3.6" fill="#fff"/></g>
    <g class="eyeR" transform="translate(160 140)"><ellipse rx="9.5" ry="12.5" fill="${AV_INK}"/><circle cx="-3" cy="-5" r="3.6" fill="#fff"/></g>
    <ellipse cx="130" cy="161" rx="15" ry="11" fill="${AV_INK}"/><ellipse cx="125" cy="157" rx="4.5" ry="2.6" fill="#fff" opacity=".6"/>
    <ellipse cx="78" cy="170" rx="13" ry="8" fill="#ff9aa6" opacity=".45"/><ellipse cx="182" cy="170" rx="13" ry="8" fill="#ff9aa6" opacity=".45"/>
    <g transform="translate(130 182)">
      <path class="mouthClosed" d="M-15 -3 Q-7.5 6 0 -3 Q7.5 6 15 -3" stroke="${AV_INK}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <g class="mouthOpen"><ellipse class="mo" rx="13" ry="8" fill="#3a2320"/><ellipse class="tongue" rx="8" ry="4" fill="#ff8a95"/></g>
    </g>
    <path d="M86 226 Q130 244 174 226" stroke="#d97757" stroke-width="12" fill="none" stroke-linecap="round"/>
    <rect x="113" y="229" width="34" height="21" rx="6" fill="#ffd400" stroke="${AV_INK}" stroke-width="3"/>
    <text x="130" y="244" text-anchor="middle" font-size="13" font-weight="900" fill="${AV_INK}" font-family="Menlo, monospace">&lt;/&gt;</text>
  </g>
</svg>`;
let AV;
function mountAvatar(parent, { left, top, size }) {
  const el = document.createElement('div');
  Object.assign(el.style, { position: 'absolute', left: left + 'px', top: top + 'px', width: size + 'px', height: size + 'px', zIndex: 4 });
  el.innerHTML = AVATAR_SVG;
  parent.appendChild(el);
  const q = c => el.querySelector('.' + c);
  AV = { el, ears: [q('earL'), q('earR')], body: q('avBody'), eyes: [q('eyeL'), q('eyeR')], closed: q('mouthClosed'), open: q('mouthOpen'), mo: q('mo'), tongue: q('tongue') };
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
  // 귀: 붙은 자리를 축으로 살랑살랑 (말할 때 더 크게)
  const sw = (talking ? 5 : 1.8) * Math.sin(t * 5.2);
  AV.ears[0].setAttribute('transform', `rotate(${(sw).toFixed(2)} 80 66)`); AV.ears[1].setAttribute('transform', `rotate(${(-sw).toFixed(2)} 180 66)`);
  AV.body.setAttribute('transform',
    `translate(0 ${(-7 * a - 2 * Math.sin(t * 2.4)).toFixed(2)}) rotate(${((talking ? 1 : 0) * 2.5 * Math.sin(t * 3.1)).toFixed(2)} 130 240)`);
}
