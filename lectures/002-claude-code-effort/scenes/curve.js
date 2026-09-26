// effort 곡선 (Terminal-Bench 3.0, 통과율 vs 시도당 토큰 중앙값, 로그 축)
// 원문 claude.dev/blog/spending-your-effort 의 그래프에서 점 위치를 눈으로 읽은 근삿값 — 화면에는 "원문 그래프 재구성 · 근삿값" 표기
// curveSVG({ w, h, show: 0~1 (선이 그려진 정도), only: ['Opus 5.5'] 강조, labels: true })
window.CURVE = [
  { name: 'Opus 5.5', color: '#5b6bb5', pts: [['low', 40, 36.5], ['medium', 82, 54.5], ['high', 103, 59], ['xhigh', 185, 62.5], ['max', 275, 65.5]] },
  { name: 'Fable 5.1', color: '#c0785a', pts: [['low', 67, 32], ['medium', 88, 40], ['high', 122, 46], ['xhigh', 178, 54], ['max', 205, 58]] },
  { name: 'Opus 5', color: '#3a3a3a', pts: [['low', 78, 27], ['medium', 117, 37.5], ['', 160, 43.5], ['', 200, 47], ['max', 250, 50.5]] },
  { name: 'Fable 5', color: '#b3b0a8', pts: [['low', 63, 22.5], ['medium', 88, 33.5], ['', 115, 36.5], ['xhigh', 145, 43.5], ['max', 170, 43.5]] },
];
window.curveSVG = ({ w = 1000, h = 640, show = 1, only = null, labels = true, grid = true, font = 1, half = 0 } = {}) => {
  const pad = { l: 90 * font, r: 190 * font, t: 30, b: 70 * font };
  const X = k => pad.l + (Math.log(k) - Math.log(30)) / (Math.log(330) - Math.log(30)) * (w - pad.l - pad.r);
  const Y = p => h - pad.b - (p - 18) / (70 - 18) * (h - pad.t - pad.b);
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="Pretendard">`;
  if (grid) {
    for (const p of [20, 30, 40, 50, 60, 70]) s += `<line x1="${pad.l}" x2="${w - pad.r + 60}" y1="${Y(p)}" y2="${Y(p)}" stroke="#e2ded5" stroke-width="2"/><text x="${pad.l - 16}" y="${Y(p) + 9 * font}" text-anchor="end" font-size="${26 * font}" fill="#9a958c" font-weight="600">${p}%</text>`;
    for (const k of [50, 100, 200, 300]) s += `<text x="${X(k)}" y="${h - pad.b + 44 * font}" text-anchor="middle" font-size="${26 * font}" fill="#9a958c" font-weight="600">${k}k</text>`;
  }
  // 강조 안 한 선 먼저, 강조한 선이 위로
  const order = [...CURVE].sort((a, b) => (only?.includes(a.name) ? 1 : 0) - (only?.includes(b.name) ? 1 : 0));
  for (const c of order) {
    const dim = only && !only.includes(c.name), col = dim ? '#d6d2c9' : c.color, sw = (dim ? 4 : 7) * font;
    const P = c.pts.map(([, k, p]) => [X(k), Y(p)]);
    const len = P.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - P[i][0], q[1] - P[i][1]), 0);
    s += `<polyline points="${P.map(q => q.join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - show)}"/>`;
    let acc = 0;
    P.forEach((q, i) => {
      if (i) acc += Math.hypot(q[0] - P[i - 1][0], q[1] - P[i - 1][1]);
      if (acc > len * show + .5) return;
      s += `<circle cx="${q[0]}" cy="${q[1]}" r="${(dim ? 7 : 11) * font}" fill="${col}" stroke="#f6f4ef" stroke-width="${3 * font}"/>`;
      const lab = c.pts[i][0];
      if (labels && lab && !dim) s += `<text x="${q[0]}" y="${q[1] - 22 * font}" text-anchor="middle" font-size="${24 * font}" fill="#77726a" font-family="SF Mono, Menlo, monospace">${lab}</text>`;
    });
    if (show >= 1 && !dim) { const q = P[P.length - 1]; s += `<text x="${q[0] + 20 * font}" y="${q[1] + 11 * font}" font-size="${34 * font}" font-weight="800" fill="#1d1c1a">${c.name}</text>`; }
  }
  // half(0~1): 같은 점수, 토큰은 절반 — Opus 5.5 high ↔ Fable 5.1 max 점선
  if (half > 0) {
    const [, k1, p1] = CURVE[0].pts[2], [, k2, p2] = CURVE[1].pts[4];
    s += `<g opacity="${half}"><line x1="${X(k1)}" y1="${Y(p1)}" x2="${X(k2)}" y2="${Y(p2)}" stroke="#77726a" stroke-width="${3 * font}" stroke-dasharray="${8 * font} ${7 * font}"/>`
      + `<text x="${(X(k1) + X(k2)) / 2 - 40 * font}" y="${Y(p1) + 56 * font}" text-anchor="middle" font-size="${30 * font}" font-weight="800" fill="#1d1c1a">같은 점수, 토큰은 절반</text></g>`;
  }
  return s + '</svg>';
};
