// 003 쇼츠·릴스 2편 (9:16) — 서로 다른 각도: ① 결과(완성 매드무비 5편을 유형으로) ② 꼼수(맥 내장 누끼)
//   음성·길이·입 모양: node lectures/003-mad-movie/scenes/timing.mjs shorts
//   렌더: node toolkit/render.mjs lectures/003-mad-movie/scenes/shorts.html --query s=1 --name shorts-1   (s=1|2)
// 챕터 종류: hook · clip · list · shot · duo · cta   media: { image } 또는 { clip, from, len }
const L = '/lectures/003-mad-movie';
const V = n => ({ clip: `${L}/scenes/clips/v-${n}`, from: 0, len: 15 });

window.SCRIPT = { toSay: window.toSay, voice: window.VOICE, styles: [], chapters: [
  // ① 이거 전부 AI가 편집한 영상
  { short: 1, type: 'hook', hook: '이거 전부\n<em>AI가</em> 편집했어요', media: { ...V('dance'), from: 2 }, say: [
    '이 매드무비, 전부 오푸스 5.5가 편집했어요. 누끼, 박자, 자막까지요.',
  ] },
  { short: 1, type: 'clip', title: '러닝 앱 광고', media: { ...V('runner'), from: 6 }, say: ['러닝 앱 광고도,'] },
  { short: 1, type: 'clip', title: '소개팅 앱 광고', media: { ...V('blurry'), from: 5 }, say: ['소개팅 앱 광고도,'] },
  { short: 1, type: 'clip', title: '알람 앱 광고', media: { ...V('morning'), from: 7 }, say: ['알람 앱 광고도,'] },
  { short: 1, type: 'clip', title: '사진 일기 앱 광고', media: { ...V('memory'), from: 4 }, say: ['사진 일기 앱 광고도, 설정 파일 하나만 바꿨어요.'] },
  { short: 1, type: 'cta', say: ['만드는 법은 긴 영상에 있어요. 저장해 두세요!'] },

  // ② 맥에 누끼 기능이 숨어 있다
  { short: 2, type: 'hook', hook: '맥에 <em>누끼</em> 기능\n숨어 있어요', media: { image: `${L}/captures/cut-after.png`, dim: true }, say: [
    '맥에, 누끼를 따는 기능이 숨어 있는 거 아세요?',
  ] },
  { short: 2, type: 'duo', title: '설치 없이 이렇게', a: { image: `${L}/captures/cut-before.png` }, b: { image: `${L}/captures/cut-after.png` }, labelA: '원본', labelB: '누끼', say: [
    '사진 앱의 피사체 들어올리기, 그 기능을 오푸스가 명령어로 만들어 줬어요.',
  ] },
  { short: 2, type: 'list', title: '영상 누끼도 된다', items: ['영상 → 프레임으로 풀기', '프레임마다 누끼 (Vision)', '360장에 25초'], say: [
    '영상을 프레임으로 풀고,',
    '프레임마다 누끼를 따면,',
    '360장이 25초 만에 끝나요.',
  ] },
  { short: 2, type: 'cta', say: ['매드무비 만드는 전체 과정은, 긴 영상에 있어요!'] },
] };
