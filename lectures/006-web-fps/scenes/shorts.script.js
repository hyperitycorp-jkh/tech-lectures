// 006 쇼츠 3편 (9:16) — 서로 다른 각도: ① 결과(진짜 판교역 FPS) ② 반전(FPS 서버비 0원 구조) ③ 가이드(AI로 게임 만들면 막히는 4가지)
//   음성: node lectures/006-web-fps/scenes/timing.mjs shorts · 렌더: node toolkit/render.mjs lectures/006-web-fps/scenes/shorts.html --query s=1 --name shorts-1
// 게임 화면은 전부 실제 플레이 녹화(demo/capture-game.mjs). 수치는 research.md
const L = '/lectures/006-web-fps', C = n => `${L}/scenes/clips/${n}`;

window.SCRIPT = { toSay: window.toSay, voice: window.VOICE, styles: [], chapters: [
  // ① 결과: 하루 만에 만든 FPS, 진짜 판교역
  { short: 1, type: 'hook', hook: 'AI로 하루 만에\n만든 <em>FPS</em>', media: { clip: C('fp-pangyo'), from: 19.0, game: true }, say: [
    'AI로 하루 만에 만든 FPS예요. 브라우저랑 폰에서 바로 돼요.',
  ] },
  { short: 1, type: 'duo', title: '맵은 진짜 판교역', a: { image: `${L}/captures/osm-pangyo-crop.png` }, b: { clip: C('air-pangyo'), from: 1 }, labelA: '오픈스트리트맵', labelB: '게임 맵', say: [
    '맵은 진짜 판교역이에요. 오픈스트리트맵 건물 자료를 그대로 썼어요.',
  ] },
  { short: 1, type: 'clip', title: '포격 · 병과 5개', media: { clip: C('fo-strike'), from: 3.6, game: true }, say: [
    '병과는 다섯 개, 관측병이 좌표를 찍으면 포병이 포를 쏴요.',
  ] },
  { short: 1, type: 'clip', title: '폰에서도 바로', media: { clip: C('mobile-gangnam'), from: 6 }, say: [
    '폰에서도 브라우저로 바로 돼요.',
  ] },
  { short: 1, type: 'cta', say: ['어떻게 만들었는지는, 긴 영상에 있어요!'] },

  // ② 반전: FPS 서버비 0원?
  { short: 2, type: 'hook', hook: 'FPS 게임\n서버비 <em>0원?</em>', media: { clip: C('fp-pangyo'), from: 29.4, game: true }, say: [
    'FPS 게임, 서버비 0원으로 돌릴 수 있을까요?',
  ] },
  { short: 2, type: 'list', title: '게임 서버 없이 돌리는 법', items: ['방장 브라우저가 판정', '나머지는 직접 연결 (WebRTC)', 'Firebase는 방 목록·신호만', '막힌 망만 TURN 중계'], say: [
    '게임 서버 대신, 방장 브라우저가 판정해요.',
    '다른 사람은 방장이랑 직접 연결되고,',
    '파이어베이스는 방 목록이랑 연결 신호만 맡아요.',
    '막힌 망만 중계를 쓰는데, 한 달에 1,000GB까지 무료예요.',
  ] },
  { short: 2, type: 'duo', title: '브라우저 두 개 → 같은 판', a: { image: `${L}/captures/two-A.png` }, b: { image: `${L}/captures/two-B.png` }, labelA: 'A · 방장', labelB: 'B · 핑 1ms', say: [
    '실제로 브라우저 두 개로 빠른 시작을 누르면, 같은 판에서 바로 만나요.',
  ] },
  { short: 2, type: 'cta', say: ['방장만 유리하지 않게 판정하는 법은, 긴 영상에 있어요!'] },

  // ③ 가이드: AI로 게임 만들면 꼭 막히는 4가지
  { short: 3, type: 'hook', hook: 'AI로 게임 만들면\n꼭 <em>막히는</em> 4가지', media: { clip: C('fp-night'), from: 24.4, game: true }, say: [
    'AI로 멀티플레이 게임 만들면, 꼭 막히는 4가지가 있어요.',
  ] },
  { short: 3, type: 'list', title: '문제 → 해결', items: ['늘 혼자 AI 판 → 연결 뒤에 자리 요청', '배포 직후 안 뜸 → 이전 빌드 남기기', '폰 버튼 13개 → 상황 따라 7개', '판이 늘어짐 → AI끼리 템포 측정'], say: [
    '하나, 빠른 시작해도 늘 혼자예요. 연결이 열린 뒤에 자리를 요청하게 고쳤어요.',
    '둘, 배포 직후 화면이 안 떠요. 이전 빌드 파일을 남겨 두면 돼요.',
    '셋, 폰 버튼이 13개였어요. 상황에 맞게 뜨게 해서 7개로 줄였어요.',
    '넷, 기능을 넣을수록 판이 늘어져요. AI끼리 붙여서 템포를 재요.',
  ] },
  { short: 3, type: 'cta', say: ['게임 주소랑 시작 프롬프트는, 긴 영상 설명란에 있어요!'] },
] };
