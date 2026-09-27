// 002 쇼츠·릴스 2편 대본 (9:16, 각 30초 안팎). 음성 설정·발음은 voice.js (롱폼과 같은 목소리)
//   음성·길이·입 모양: node lectures/002-claude-code-effort/scenes/timing.mjs shorts
//   렌더: node toolkit/render.mjs lectures/002-claude-code-effort/scenes/shorts.html --query s=1 --name shorts-1   (s=1|2|3)
// ③ 은 직접 돌린 데모(demo/thumb-low · thumb-high, 각 1회) — ①②와 다른 각도(요약이 아니라 결과)
// 챕터 종류: hook · clip · list · shot(결과 한 장 + 기록) · duo(두 결과 위아래) · cta   media: { image } 또는 { clip, ... }
const L = '/lectures/002-claude-code-effort';
const BLOG = { image: `${L}/captures/blog.png` };
const LOW = { image: `${L}/demo/thumb-low/thumb.png` }, HIGH = { image: `${L}/demo/thumb-high/thumb.png` };

window.SCRIPT = { toSay: window.toSay, voice: window.VOICE, styles: [], chapters: [
  // ① effort, 이것만 기억하세요
  { short: 1, type: 'hook', hook: '클로드 코드 effort\n<em>이것만</em> 기억하세요', media: BLOG, say: [
    '클로드 코드 effort, 뭘로 두고 쓰세요? 이것만 기억하세요.',
  ] },
  { short: 1, type: 'list', title: '단계별로 이럴 때', items: ['low — 스케치 · 쉬운 수정', 'medium — 대부분의 새 기능', 'high — 버그 수정 · 검증', 'max — 어려운 문제 통째로'], say: [
    'low는 아이디어나 쉬운 수정, medium은 대부분의 새 기능,',
    'high는 버그 수정처럼 검증이 중요한 일, max는 어려운 문제를 통째로 맡길 때.',
  ] },
  { short: 1, type: 'cta', say: ['클로드 코드 팀이 쓰는 순서는 긴 영상에 있어요. 저장해 두세요!'] },

  // ② effort 올리면 달라지는 것
  { short: 2, type: 'hook', hook: 'effort 올리면\n<em>뭐가</em> 달라질까?', media: BLOG, say: [
    '클로드 코드 effort, 올리면 뭐가 달라질까요?',
  ] },
  { short: 2, type: 'list', title: '원문 실험 결과', items: ['HTML 정화기 1/5 → 5/5', '놓친 예외 59 → 24', '접근법 틀린 건 못 고침'], say: [
    '자바스크립트 걸러내는 과제에서, low는 다섯 번 중 한 번, high는 다섯 번 다 성공했어요.',
    '놓친 예외 케이스는 59개에서 24개로 줄었고요.',
    '그런데 접근법 자체가 틀린 건, 올려도 안 고쳐져요.',
  ] },
  { short: 2, type: 'cta', say: ['언제 뭘 쓰는지는 긴 영상에 정리했어요. 저장해 두세요!'] },

  // ③ 같은 요청, effort만 바꿔 봤다 (데모)
  { short: 3, type: 'hook', hook: '같은 요청,\neffort만 <em>바꿔 봤다</em>', media: { ...HIGH, dim: true }, prompt: '"유튜브 썸네일 만들어줘"', prompt2: 'effort <b>low</b> vs <b>high</b>', say: [
    '클로드 코드한테 똑같이, 유튜브 썸네일을 만들어 달라고 했어요. effort만 바꿔서요.',
  ] },
  { short: 3, type: 'shot', tag: 'effort low', media: LOW, note: '21초 · 도구 2번 · 렌더 확인 <em>안 함</em>', say: [
    'low는 21초 만에 끝냈어요. 파일 하나 쓰고, 확인 없이 바로 끝.',
  ] },
  { short: 3, type: 'shot', tag: 'effort high', hi: true, media: HIGH, note: '63초 · 도구 5번 · 직접 렌더해서 <em>확인</em>', say: [
    'high는 1분쯤 걸렸는데, 직접 렌더해 보고 확인까지 했어요.',
  ] },
  { short: 3, type: 'duo', title: '나란히 보면', a: LOW, b: HIGH, say: [
    '나란히 놓으면 차이가 확 보이죠. 시간은 세 배 걸렸고, 토큰은 조금 더 썼어요.',
  ] },
  { short: 3, type: 'cta', say: ['언제 뭘 쓰는지는 긴 영상에 정리해 뒀어요. 저장해 두세요!'] },
] };
