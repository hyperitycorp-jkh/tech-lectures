// 002 쇼츠·릴스 2편 대본 (9:16, 각 30초 안팎). 음성 설정·발음은 voice.js (롱폼과 같은 목소리)
//   음성·길이·입 모양: node lectures/002-claude-code-effort/scenes/timing.mjs shorts
//   렌더: node toolkit/render.mjs lectures/002-claude-code-effort/scenes/shorts.html --query s=1 --name shorts-1   (s=1|2)
// 챕터 종류: hook · clip · list · cta   media: { image } 또는 { clip, ... }
const L = '/lectures/002-claude-code-effort';
const BLOG = { image: `${L}/captures/blog.png` };

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
] };
