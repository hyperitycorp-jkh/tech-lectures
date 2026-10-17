// 007 쇼츠 3편 (9:16) — 서로 다른 각도: ① 가이드(무료 플러그인 3개, 뭘 깔까) ② 반전(조회수 1,200, 실제로 본 건 26%) ③ 결과(썸네일을 폰 크기로 검사)
//   음성: node lectures/007-marketing-plugins/scenes/timing.mjs shorts · 렌더: node toolkit/render.mjs lectures/007-marketing-plugins/scenes/shorts.html --query s=1 --name shorts-1
// 수치는 research.md · demo/results/*.md · YouTube Analytics(2026-09-25~10-16)
const L = '/lectures/007-marketing-plugins/captures';

window.SCRIPT = { toSay: window.toSay, voice: window.VOICE, styles: [], chapters: [
  // ① 가이드: 무료 마케팅 플러그인 3개, 뭘 깔까
  { short: 1, type: 'hook', hook: '클로드 무료\n마케팅 플러그인 <em>3개</em>', media: { image: `${L}/gh-sms.png`, dim: true }, say: [
    '클로드 무료 마케팅 플러그인 세 개, 직접 깔아서 써 봤어요.',
  ] },
  { short: 1, type: 'list', title: '이렇게 고르세요', items: ['유튜브 · 쓰레드 → Social Media Skills', '카피 · 앱스토어 → marketingskills', '보고서 · 이메일 → 앤트로픽 공식'], say: [
    '유튜브랑 쓰레드는 Social Media Skills,',
    '제목 카피랑 앱스토어는 marketingskills,',
    '보고서랑 이메일은 앤트로픽 공식 플러그인이에요.',
  ] },
  { short: 1, type: 'cta', say: ['단, 통째로 깔지 말고 필요한 것만! 이유는 긴 영상에 있어요.'] },

  // ② 반전: 조회수 1,200회, 실제로 본 사람은?
  { short: 2, type: 'hook', hook: '조회수 1,200회\n실제로 본 건 <em>?</em>', media: { image: `${L}/thumb-006.png`, dim: true }, say: [
    '제 쇼츠 조회수 1,200회, 실제로 본 사람은 몇 명일까요?',
  ] },
  { short: 2, type: 'list', title: 'AI가 짚고, 데이터로 확인', items: ['조회 9,705회', '실제로 본 건 2,570회'], say: [
    'AI 마케팅 플러그인이, 조회수는 본 사람 수가 아니라고 짚었어요.',
    '유튜브 분석을 열어 보니, 9,705회 중에',
  ] },
  { short: 2, type: 'hook', hook: '실제로 본 건\n<em>26%</em>', big: true, media: { image: `${L}/thumb-006.png`, dim: true }, say: [
    '실제로 본 건 2,570회, 26%였어요.',
  ] },
  { short: 2, type: 'cta', say: ['진단 전체랑 플러그인 비교는, 긴 영상에 있어요!'] },

  // ③ 결과: 썸네일을 폰 크기로 검사
  { short: 3, type: 'hook', hook: 'AI한테 썸네일\n<em>검사</em> 맡겼더니', media: { image: `${L}/thumb-006.png`, dim: true }, say: [
    'AI 플러그인한테 제 썸네일 검사를 맡겨 봤어요.',
  ] },
  { short: 3, type: 'duo', title: '폰 화면 크기로 줄이면', a: { image: `${L}/thumb-006.png` }, b: { image: `${L}/thumb-006-mobile.png` }, labelA: '원래 크기', labelB: '폰 크기 168×94', say: [
    '폰 화면 크기로 줄여 보니, 아래쪽 글자는 4픽셀이라 하나도 안 읽혀요.',
  ] },
  { short: 3, type: 'list', title: '고칠 것 3가지', items: ['큰 글자는 한 덩어리', '제목 반복 금지', '오른쪽 아래 비우기'], say: [
    '큰 글자는 한 덩어리로,',
    '제목이랑 같은 말은 빼고,',
    '오른쪽 아래는 재생 시간 자리라 비워야 한대요.',
  ] },
  { short: 3, type: 'cta', say: ['고친 뒤 결과는, 다음 영상에서 보여 드릴게요!'] },
] };
