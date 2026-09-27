// 댄스 매드무비 (공개용 예시) — Mixkit 무료 스톡 영상(Stock Video Free License), 음악은 render.mjs 'teaser' 합성
// 소스: media/33899(연기 실루엣) 40367(체크 셔츠) 51314(농구 코트) 43210(폐건물 홀) → clips/<이름>(jpg) + clips/<이름>-cut(누끼 png)
window.MAD = {
  size: 'h', bpm: 128, title: 'MOVE',
  clips: {
    smoke: { dir: 'clips/smoke' },
    plaid: { dir: 'clips/plaid', cut: 'clips/plaid-cut' },
    court: { dir: 'clips/court', cut: 'clips/court-cut' },
    hall: { dir: 'clips/hall' },
  },
  bars: [
    { fx: 'letters', clip: 'smoke', from: 10 },
    { fx: 'riser', clip: 'plaid', from: 20 },
    { fx: 'pop', clip: 'plaid', from: 60 },
    { fx: 'echo', clip: 'court', from: 30, caps: ['멈추지 마', '끝까지'] },
    { fx: 'cuts', clips: ['hall', 'smoke'], froms: [60, 120] },
    { fx: 'behind', clip: 'plaid', from: 200, caps: ['지금', '이 순간'] },
    { fx: 'letterbox', clip: 'hall', from: 120 },
    { fx: 'outro', clip: 'plaid', frame: 260 },
  ],
  credit: 'footage: Mixkit · edited by Claude Opus 5.5',
};
