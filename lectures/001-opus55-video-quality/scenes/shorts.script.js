// 001 쇼츠·릴스 3편 대본 (9:16, 각 30~45초). 음성 설정·발음은 voice.js (롱폼과 같은 목소리)
//   음성·길이·입 모양: node lectures/001-opus55-video-quality/scenes/timing.mjs shorts
//   렌더: node toolkit/render.mjs lectures/001-opus55-video-quality/scenes/shorts.html --query s=1 --name shorts-1   (s=1|2|3)
// 챕터 종류: hook(첫 문구 + 영상) · reel(스타일 8개를 이름표와 함께 빠르게) · clip(영상 + 제목) · list(항목 카드) · cta
// media: { clip, from, len, pp, v(세로 영상), abs(편 시작부터 이어서 재생) } 또는 { image }

const L = '/lectures/001-opus55-video-quality';
const REEL = `${L}/clips/reel`;
const STYLES = ['모션그래픽', '수채화', '3D', '셰이더', '키네틱 타이포', 'React UI', '데이터 차트', '픽셀아트'];
const BLURRY = { clip: `${L}/clips/blurry`, v: true, abs: true };
const DIM = { clip: REEL, from: 18, len: 5.8, pp: true, dim: true };

window.SCRIPT = { toSay: window.toSay, voice: window.VOICE, styles: STYLES, chapters: [
  // ① 코드로 만든 영상 8종
  { short: 1, type: 'hook', hook: '이거 전부\n<em>코드로</em> 만든 영상', media: { clip: REEL, from: 13, len: 5.8, pp: true }, say: [
    '이 영상들, 전부 영상 AI 없이 코드로 만들었어요.',
  ] },
  { short: 1, type: 'reel', title: '스타일 8가지', say: [
    '모션그래픽, 수채화, 3D, 셰이더,',
    '키네틱 타이포, 앱 화면, 데이터 차트, 픽셀아트까지.',
  ] },
  { short: 1, type: 'clip', title: 'HTML → Chrome → ffmpeg', media: { clip: `${L}/clips/codevid`, from: 2, len: 9 }, say: [
    'Claude가 짠 코드가 그림을 한 장씩 그리고, 크롬으로 찍어서 ffmpeg로 묶은 거예요.',
  ] },
  { short: 1, type: 'cta', say: ['만드는 법이랑 코드는 전부 공개했어요. 저장해 두세요!'] },

  // ② 블러리 홍보 영상
  { short: 2, type: 'hook', hook: '얼굴이 점점\n<em>선명해지는</em> 광고', media: BLURRY, say: [
    '소개팅 앱 홍보 영상인데요, 이거 전부 코드로 만들었어요.',
  ] },
  { short: 2, type: 'clip', title: 'CSS blur 34px → 0', media: BLURRY, say: [
    '대화할수록 얼굴이 선명해지는 앱이라서, 블러 값을 34px에서 0까지 줄였어요.',
  ] },
  { short: 2, type: 'clip', title: '레포에 있는 것만', media: BLURRY, say: [
    '색, 로고, 폰트, 문구는 전부 앱 레포에 있는 것만 썼어요.',
  ] },
  { short: 2, type: 'cta', say: ['다른 앱 두 편이랑 만드는 법도 올려 뒀어요!'] },

  // ③ 에러 없이 돌아도 틀린 실수 3개
  { short: 3, type: 'hook', hook: '에러 없이 돌아도\n영상은 <em>틀릴 수 있어요</em>', media: DIM, say: [
    'AI한테 코드로 영상을 만들게 했더니, 에러 하나 없이 렌더됐는데 틀린 게 세 개 있었어요.',
  ] },
  { short: 3, type: 'list', title: '실제로 잡은 실수 3개', items: ['제목 두 개가 0.2초 겹침', '폰 화면이 틀 안에서 잘림', '출처에 없는 내용을 붙임'], say: [
    '하나, 장면이 바뀔 때 제목 두 개가 0.2초 겹쳤어요.',
    '둘, 폰 화면이 틀 안에서 잘려 보였어요.',
    '셋, 출처에 없는 내용을 그럴듯하게 붙였어요. 이게 제일 무서워요.',
  ] },
  { short: 3, type: 'clip', title: '그래서 프레임을 눈으로', media: { image: `${L}/captures/contact-sheet.png` }, say: [
    '그래서 렌더하고 나면, 프레임을 모아서 꼭 눈으로 확인해요.',
  ] },
  { short: 3, type: 'cta', say: ['전체 과정은 긴 영상에 있어요. 저장해 두세요!'] },
] };
