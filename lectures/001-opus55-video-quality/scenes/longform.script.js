// 001 롱폼 대본 + 장면 구성. 문구·수치는 README.md / research.md 원문 기준.
// 구성: 결과 몽타주(훅) → 약속 + 궁금증 걸기 → 본론 → 구독 한 줄 → 평가(걸어 둔 실수 3개 회수) → 따라 하기 → 엔드카드
// 나레이션 음성·길이·입 모양은 timing.mjs 가 만든다 (대본을 고치면 다시 실행, 고친 줄만 새로 생성).
//   node lectures/001-opus55-video-quality/scenes/timing.mjs
// 챕터 종류: montage · cover · points · code · image(big) · side · trio · endcard
// clip: { clip: 폴더, from: 시작 초, len: 반복 길이(초), pp: 앞뒤로 오가며 반복 }

// 음성 설정·발음 치환(VOICE, toSay)은 voice.js (쇼츠와 공유)

const L = '/lectures/001-opus55-video-quality';
const REEL = `${L}/clips/reel`;
const style = (k, title, say) => ({ type: 'image', big: true, kicker: `스타일 ${k + 1}/8`, title, clip: REEL, from: k * 6 + .1, len: 5.8, pp: true, say });

window.SCRIPT = { toSay: window.toSay, voice: window.VOICE, chapters: [
  { type: 'montage', title: '영상 AI 없이,\n코드로 만든 영상', cutLen: 1.1, cuts: [
      { clip: REEL, from: 13 }, { clip: `${L}/clips/blurry`, from: 9.5, v: true }, { clip: REEL, from: 19 },
      { clip: `${L}/clips/morning`, from: 5, v: true }, { clip: REEL, from: 25 }, { clip: `${L}/clips/runner`, from: 4.5, v: true },
      { clip: REEL, from: 31 }, { clip: REEL, from: 43 }, { clip: `${L}/clips/codevid`, from: 7 }, { clip: REEL, from: 37 }], say: [
    '이 영상들, 전부 영상 AI 없이 코드로 만들었어요.',
    '카메라도 편집 프로그램도 안 썼어요. Claude가 짠 코드가 그림을 한 장씩 그린 거예요.',
  ] },
  { type: 'points', kicker: '이 영상에서', title: '끝까지 보시면', points: ['어떻게 만드는지 — 원리와 파이프라인', '퀄리티는 어디까지 — 8가지 스타일, 실제 앱 홍보 영상', '직접 해보는 법 — 코드 전부 공개'], say: [
    '오늘은 이걸 어떻게 만드는지, 퀄리티는 어디까지 나오는지, 그리고 직접 해보는 방법까지 보여 드릴게요.',
    '마지막엔, 에러 하나 없이 멀쩡하게 렌더됐는데 알고 보니 틀렸던 실수 세 가지도 공개할게요.',
  ] },
  { type: 'image', kicker: '시작', title: '출시 당일 공개된 뮤직비디오 소스',
    image: `${L}/captures/pdoom-github.png`, source: 'github.com/JohnHeibel/PDoomVideo', say: [
    '시작은 Opus 5.5 출시 날이었어요. 같은 날 뮤직비디오 하나가 공개됐는데요,',
    'p5.js로 그림을 그리고, 헤드리스 Chrome으로 한 장씩 찍어서, ffmpeg로 묶은 영상이었어요.',
    '사람은 캐릭터 디자인이랑, 가사마다 어떤 장면을 넣을지만 정해 줬대요.',
  ] },

  { type: 'points', kicker: '01 · 원리', title: '영상은 그림 여러 장이다', points: ['30fps = 1초에 그림 30장', '12초 영상 = 그림 360장', 'renderFrame(f) = f번째 그림을 그리는 함수'], say: [
    '원리는 진짜 단순해요. 영상은 그림을 빠르게 넘기는 거잖아요.',
    '1초에 30장이면, 12초짜리 영상은 그림 360장이에요.',
    '그러니까 Claude는 영상을 만드는 게 아니라, f번째 그림을 그리는 함수 하나를 짜는 거예요.',
  ] },
  { type: 'code', kicker: '01 · 원리', title: 'renderFrame(f) — 실제 코드', source: 'scenes/styles/01-motion.html (일부)', code:
`window.renderFrame = f => {
  const t = f / FPS;
  g.fillStyle = '#f4efe6'; g.fillRect(0, 0, W, H);
  const p1 = ease(prog(t, .8, 1.8));
  const p2 = ease(prog(t, 2.4, 3.4));
  const p3 = ease(prog(t, 4.0, 5.0));
  for (let i = 0; i < N; i++) {
    const appear = back(prog(t, i * .012, .4 + i * .012));
    ...`, say: [
    '실제 코드는 이래요. 프레임 번호 f를 시간 t로 바꾸고,',
    '그 시간에 맞춰서 점 서른여섯 개를 어디에 그릴지 계산해요.',
    '같은 f를 넣으면 항상 같은 그림이 나오니까, 몇 번을 다시 뽑아도 결과가 똑같아요.',
  ] },

  { type: 'image', big: true, kicker: '02 · 파이프라인', title: 'HTML → 헤드리스 Chrome → ffmpeg',
    clip: `${L}/clips/codevid`, from: 0, len: 12, say: [
    '이걸 영상 파일로 만드는 건 딱 세 단계예요.',
    '첫째, 장면을 HTML로 짜요. 캔버스든 3D든, 브라우저가 그릴 수 있는 건 다 돼요.',
    '둘째, 화면 없는 크롬을 띄워서 프레임마다 스크린샷을 찍어요.',
    '셋째, 쌓인 PNG를 ffmpeg가 MP4로 묶어요. 배경음도 코드로 만들었어요.',
  ] },
  { type: 'code', kicker: '02 · 파이프라인', title: '캡처 루프 — 실제 코드', source: 'scenes/render.mjs (일부)', typeSeconds: 4, code:
`const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('file://' + resolve('scene.html'));

for (let f = 0; f < total; f++) {
  const b64 = await page.evaluate(n => window.renderFrame(n), f);
  writeFileSync(\`frames/\${String(f).padStart(4, '0')}.png\`, Buffer.from(b64, 'base64'));
}
await browser.close();

execFileSync('ffmpeg', [..., '-i', 'frames/%04d.png', ..., 'output.mp4']);`, say: [
    '찍는 코드는 이게 거의 다예요. 크롬을 열고, 프레임 수만큼 돌면서 그림을 저장하고,',
    '마지막에 ffmpeg 한 번이면 끝. 도구는 전부 무료예요.',
  ] },
  { type: 'points', kicker: '02 · 파이프라인', title: '렌더 시간', points: ['48초 쇼릴 → 약 3분', '20초 홍보 영상 → 약 1분', '로컬 Mac 한 대에서'], say: [
    '시간도 얼마 안 걸려요. 48초짜리 쇼릴이 3분쯤, 20초짜리 홍보 영상이 1분쯤 걸렸어요. 전부 제 맥 한 대로요.',
  ] },

  { type: 'cover', title: '8가지 스타일', sub: '모션그래픽 · 수채화 · 3D · 셰이더 · 키네틱 타이포 · React UI · 데이터 · 픽셀아트',
    bg: { clip: REEL, from: 0, len: 48 }, say: [
    '그럼 이 방식으로 어디까지 그릴 수 있을까요? 스타일 여덟 개를 만들어 봤어요.',
  ] },
  style(0, '모션그래픽 — Canvas 2D', ['먼저 모션그래픽. 점 서른여섯 개가 원이 됐다가, 격자가 됐다가, 파도가 돼요.']),
  style(1, '수채화 — p5.js', ['이건 p5.js로 만든 수채화예요. 물감이 번지는 느낌, 괜찮죠?']),
  style(2, '3D — Three.js', ['Three.js로 만든 3D예요. 조명이랑 그림자까지 들어가요.']),
  style(3, '셰이더 — WebGL GLSL', ['셰이더는 픽셀 하나하나의 색을 GPU가 계산해서, 이런 대리석 무늬가 나와요.']),
  style(4, '키네틱 타이포 — HTML/CSS', ['글자가 움직이는 키네틱 타이포예요. 글자가 절대 안 깨지는 게 코드 방식의 큰 장점이에요.']),
  style(5, '앱 UI 데모 — React', ['실제 React 앱 화면도 이렇게 움직일 수 있어요. 앱 소개 영상에 딱이에요.']),
  style(6, '데이터 애니메이션 — D3', ['D3로 만든 순위 차트예요. 여기 숫자는 예시 데이터고요.']),
  style(7, '픽셀아트 — Canvas 160×90', ['마지막은 픽셀아트! 점수 글자는 비트맵 폰트를 직접 그렸어요.', '이 여덟 개가 전부 렌더 스크립트 하나로 나왔어요.']),

  { type: 'cover', title: '실제 앱 홍보 영상 3편', sub: '레포에 있는 브랜드 색 · 로고 · 폰트 · 스토어 문구만으로', say: [
    '근데 데모는 데모잖아요. 그래서 실제 서비스 중인 앱 세 개로 홍보 영상을 만들어 봤어요.',
    '규칙은 하나. 앱 레포에 있는 색, 로고, 폰트, 스토어 문구만 쓰기.',
  ] },
  { type: 'trio', kicker: '홍보 영상', title: '세로 20초 × 3편', items: [
      { clip: `${L}/clips/blurry`, label: '블러리' },
      { clip: `${L}/clips/morning`, label: '모닝콜' },
      { clip: `${L}/clips/runner`, label: '모두의 러너' }], say: [
    '짜잔, 세로 20초짜리 세 편이에요.',
    '소개팅 앱 블러리, 캐릭터가 깨워 주는 알람 앱 모닝콜, 그리고 러닝 앱 모두의 러너.',
    '레포의 색이랑 폰트를 그대로 써서, 앱마다 분위기가 완전히 달라요.',
  ] },
  { type: 'side', kicker: '블러리', title: '대화할수록 선명해지는 얼굴', clip: `${L}/clips/blurry`, from: 8.6, len: 3.8, pp: true,
    points: ['CSS blur 34px → 0', '폰트: 레포의 BlurryEditorial', '문구: 스토어 원문'], say: [
    '블러리는 대화할수록 상대 얼굴이 점점 선명해지는 앱이에요.',
    '그래서 블러 값을 34px에서 0까지 줄이는 걸 그대로 보여 줬어요. 폰트도 레포에 있던 전용 폰트예요.',
  ] },
  { type: 'side', kicker: '모닝콜', title: '진짜 목소리로 깨워 주는 알람', clip: `${L}/clips/morning`, from: 4, len: 16,
    points: ['알람 링 · 음성 파형: CSS transform', '알람음 · 벨소리: 코드로 합성', '캐릭터: 레포의 원본 이미지'], say: [
    '모닝콜은 캐릭터가 진짜 목소리로 깨워 주는 앱이에요.',
    '알람 링이랑 음성 파형은 CSS로 움직였고, 알람 소리도 코드로 만들었어요.',
  ] },
  { type: 'side', kicker: '모두의 러너', title: '지도 위에 그려지는 경로', clip: `${L}/clips/runner`, from: 3, len: 17,
    points: ['경로 애니메이션: SVG', '성과 수치: 보도자료 원문', '러닝 화면 숫자는 예시 (화면에 표기)'], say: [
    '모두의 러너는 지도 위에 경로가 그려지는 장면을 SVG로 새로 그렸어요.',
    '성과 숫자는 보도자료에 있는 것만 썼고, 러닝 화면 숫자는 예시라서 화면에 예시라고 적어 뒀어요.',
  ] },
  { type: 'cover', title: '재밌으셨다면 구독!', sub: '새 기술, 직접 테스트해서 계속 올릴게요', say: [
    '여기까지 재밌으셨다면 구독 한 번 눌러 주세요. 이런 실험, 계속 올릴게요.',
  ] },

  { type: 'points', kicker: '03 · 평가', title: '잘하는 것', points: ['글자 · 자막 · 로고가 깨지지 않는다', '스타일 폭이 넓다 — 2D부터 3D, 실제 UI까지', '수정은 코드 한 줄, 결과는 항상 같다', '실제 제품 화면 · 브랜드 에셋을 그대로 쓴다'], say: [
    '자, 이제 솔직한 평가예요. 잘하는 것부터요.',
    '하나, 글자가 안 깨져요. 영상 AI가 제일 약한 게 글자인데, 여기선 폰트가 그대로 찍혀요.',
    '둘, 스타일 폭이 넓어요. 2D, 3D, 셰이더, 실제 앱 화면까지 다 됐어요.',
    '셋, 고치기 쉬워요. 색 하나 바꾸는 건 코드 한 줄이고, 다시 뽑아도 똑같이 나와요.',
    '넷, 실제 제품 화면이랑 브랜드 자료를 그대로 쓸 수 있어요. 홍보 영상에선 이게 제일 커요.',
  ] },
  { type: 'points', kicker: '03 · 평가', title: '약한 것', points: ['실사 사람 · 자연 장면은 새로 못 만든다', '"알아서 완벽"하지 않다 — 영상마다 1~2회 수정'], say: [
    '약한 것도 있어요. 실사 사람이나 풍경은 새로 못 만들어요.',
    '그런 건 생성형 AI로 소스를 만들고, 코드로 편집하는 조합이 좋아요.',
    '그리고 한 번에 완벽하게 나오진 않아요. 영상마다 한두 번은 프레임을 보고 고쳐야 했어요.',
  ] },
  { type: 'points', kicker: '03 · 약속한 것', title: '에러 없이 돌았는데 틀린 실수 3개', points: ['장면 전환 때 제목 두 개가 0.2초 겹침', '폰 캡처가 틀 안에서 잘려 보임', '출처에 없는 내용을 붙임 → 원문 대조 후 삭제'], say: [
    '처음에 약속한 실수 세 가지예요. 셋 다 에러 없이 멀쩡하게 렌더된 상태였어요.',
    '하나, 장면이 바뀔 때 제목 두 개가 0.2초 겹쳤어요. 둘, 폰 화면이 틀 안에서 잘려 보였어요.',
    '셋이 제일 무서운데요, 출처에 없는 내용을 그럴듯하게 붙여 넣었어요. 원문이랑 대조해서 지웠죠.',
    '그래서 렌더하고 나면, 장면 중간이랑 바뀌는 순간 프레임을 모아서 꼭 눈으로 봐요.',
  ] },
  { type: 'points', kicker: '03 · 평가', title: '정리', points: ['글자 · 데이터 · 실제 UI가 중요한 영상 → 코드 렌더', '실사 장면이 필요하면 → 생성형 AI와 섞어 쓰기'], say: [
    '정리하면, 글자랑 데이터, 실제 앱 화면이 중요한 영상은 코드 렌더가 훨씬 편해요.',
    '실사 장면이 필요하면 생성형 AI랑 섞어 쓰면 되고요.',
  ] },

  { type: 'image', kicker: '04 · 직접 해보려면', title: '코드는 전부 공개',
    image: `${L}/captures/repo-github.png`, source: 'github.com/hyperitycorp-jkh/tech-lectures', say: [
    '코드는 전부 GitHub에 올려 뒀어요. 렌더 도구랑 템플릿, 여덟 가지 스타일까지 다 있어요.',
    '앱 홍보 영상은 회사 자료라서 빠져 있어요.',
  ] },
  { type: 'code', kicker: '04 · 직접 해보려면', title: '필요한 것: Node.js · Chrome · ffmpeg', typeSeconds: 4, code:
`git clone https://github.com/hyperitycorp-jkh/tech-lectures
cd tech-lectures && npm i

# 강의 영상 템플릿 렌더 → toolkit/templates/out/longform.mp4
node toolkit/render.mjs toolkit/templates/longform.html

# 8가지 스타일 쇼릴
cd lectures/001-opus55-video-quality/scenes
npm i playwright-core three p5 d3 react@18 react-dom@18 htm
node reel.mjs`, say: [
    'Node.js, 크롬, ffmpeg만 있으면 돼요. 레포 받고, 명령 한 줄이면 영상이 나와요.',
    'Claude Code용 스킬도 들어 있어서, 만들고 싶은 영상을 말로 설명하면 장면 코드부터 렌더, 검수까지 같은 순서로 진행해요.',
  ] },
  { type: 'endcard', title: '다음 영상에서 만나요!', sub: 'github.com/hyperitycorp-jkh/tech-lectures', hold: 20, say: [
    '영상 AI 말고, 영상을 그리는 코드. 오늘 내용은 이 한 줄이에요.',
    '다음 영상에서도 새 기술 직접 써 보고 올게요. 구독하고 기다려 주세요!',
  ] },
] };
