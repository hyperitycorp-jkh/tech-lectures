// 001 롱폼 대본 + 장면 구성. 문구·수치는 README.md / research.md 원문 기준.
// 나레이션 길이는 timing.mjs 가 macOS say 로 재서 longform.timing.js 에 적는다 (대본을 고치면 다시 실행).
//   node lectures/001-opus55-video-quality/scenes/timing.mjs
// 챕터 종류: cover · points · code · image(clip/이미지, big) · side(왼쪽 포인트 + 오른쪽 세로 영상) · trio(세로 영상 3개)
// clip: { clip: 폴더, from: 시작 초, len: 반복 길이(초), pp: 앞뒤로 오가며 반복(끊김 없음) }

// 자막은 원래 표기, 음성은 한글 발음으로 읽게 바꾼다 (긴 것부터)
const SAY_MAP = [
  ["I'm Upping My P(doom)", '아임 업핑 마이 피둠'], ['Claude Code', '클로드 코드'], ['Claude', '클로드'], ['Opus 5.5', '오퍼스 오점오'],
  ['Node.js', '노드 제이에스'], ['p5.js', '피파이브 제이에스'], ['Three.js', '쓰리 제이에스'], ['WebGL', '웹 지엘'], ['GPU', '지피유'],
  ['React', '리액트'], ['D3', '디쓰리'], ['SVG', '에스브이지'], ['CSS', '씨에스에스'], ['HTML', '에이치티엠엘'],
  ['MP4', '엠피포'], ['PNG', '피엔지'], ['ffmpeg', '에프에프엠펙'], ['Playwright', '플레이라이트'], ['Chrome', '크롬'],
  ['renderFrame', '렌더 프레임'], ['GitHub', '깃허브'], ['Mac', '맥'], ['AI', '에이아이'], ['UI', '유아이'],
  ['160×90', '160 곱하기 90'], ['34px', '34픽셀'], ['2D', '투디'], ['3D', '쓰리디'],
];
const toSay = s => SAY_MAP.reduce((a, [k, v]) => a.split(k).join(v), s);

const L = '/lectures/001-opus55-video-quality';
const REEL = `${L}/clips/reel`;
const style = (k, title, say) => ({ type: 'image', big: true, kicker: `03 · 스타일 ${k + 1}/8`, title, clip: REEL, from: k * 6 + .1, len: 5.8, pp: true, say });

window.SCRIPT = { toSay, chapters: [
  { type: 'cover', title: 'Claude가 영상을 "만든다"는 건\n무슨 뜻일까', sub: 'Opus 5.5 · 코드로 만든 영상, 퀄리티 테스트',
    bg: { clip: REEL, from: 0, len: 48 }, say: [
    'Claude Opus 5.5가 나온 뒤로, Claude로 영상을 잘 만든다는 이야기가 많이 돌았습니다.',
    '그런데 Claude가 MP4 파일을 직접 만들어 내는 건 아닙니다.',
    '오늘은 그게 정확히 어떤 방식인지, 그리고 퀄리티가 어디까지 나오는지 직접 만들어 보고 정리했습니다.',
  ] },
  { type: 'image', kicker: '00 · 계기', title: '출시 당일 공개된 뮤직비디오 소스',
    image: `${L}/captures/pdoom-github.png`, source: 'github.com/JohnHeibel/PDoomVideo', say: [
    "계기는 출시 당일 공개된 뮤직비디오, I'm Upping My P(doom)입니다.",
    '공개된 코드를 보면 p5.js로 프레임을 그리고, Node 스크립트가 헤드리스 Chrome으로 한 장씩 캡처한 뒤, ffmpeg로 묶었습니다.',
    '사람은 캐릭터 디자인과, 가사마다 어떤 비주얼과 전환을 넣을지만 지시했다고 합니다.',
  ] },
  { type: 'points', kicker: '00 · 오늘 볼 것', title: '순서', points: ['원리 — 영상은 그림 N장', '파이프라인 — HTML → Chrome → ffmpeg', '8가지 스타일 + 실제 앱 홍보 영상 3편', '퀄리티 평가, 그리고 따라 하는 법'], say: [
    '순서는 이렇습니다. 원리와 파이프라인을 먼저 보고,',
    '여덟 가지 스타일과 실제 앱 홍보 영상을 본 다음, 잘하는 것과 약한 것을 정리하겠습니다.',
  ] },

  { type: 'points', kicker: '01 · 원리', title: '영상은 그림 여러 장이다', points: ['30fps = 1초에 그림 30장', '12초 영상 = 그림 360장', 'renderFrame(f) = f번째 그림을 그리는 함수'], say: [
    '원리는 단순합니다. 영상은 결국 그림 여러 장을 빠르게 넘기는 겁니다.',
    '1초에 30장이면, 12초짜리 영상은 그림 360장입니다.',
    '그래서 Claude가 하는 일은 영상을 만드는 게 아니라, f번째 그림을 그리는 함수 하나를 짜는 겁니다.',
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
    '실제 코드는 이렇습니다. 프레임 번호 f를 받아서 초 단위 시간 t로 바꾸고,',
    '그 시간에 맞춰 점 서른여섯 개의 위치를 계산해서 그립니다.',
    '같은 f를 넣으면 항상 같은 그림이 나오니까, 몇 번을 렌더해도 결과가 똑같습니다.',
  ] },

  { type: 'image', big: true, kicker: '02 · 파이프라인', title: 'HTML → 헤드리스 Chrome → ffmpeg',
    clip: `${L}/clips/codevid`, from: 0, len: 12, say: [
    '이걸 영상 파일로 만드는 과정은 세 단계입니다. 지금 보시는 12초짜리 영상이 그 과정을 설명하려고 만든 첫 결과물입니다.',
    '첫째, 장면을 HTML 파일로 짭니다. 캔버스든 CSS든 3D든, 브라우저가 그릴 수 있으면 다 됩니다.',
    '둘째, 화면 없는 크롬, 헤드리스 Chrome을 띄워서 프레임마다 renderFrame을 실행하고 스크린샷을 찍습니다.',
    '셋째, 쌓인 PNG를 ffmpeg가 MP4로 묶습니다. 배경음도 코드로 파형을 계산해서 만들었습니다.',
  ] },
  { type: 'code', kicker: '02 · 파이프라인', title: '캡처 루프 — 실제 코드', source: 'scenes/render.mjs (일부)', typeSeconds: 5, code:
`const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('file://' + resolve('scene.html'));

for (let f = 0; f < total; f++) {
  const b64 = await page.evaluate(n => window.renderFrame(n), f);
  writeFileSync(\`frames/\${String(f).padStart(4, '0')}.png\`, Buffer.from(b64, 'base64'));
}
await browser.close();

execFileSync('ffmpeg', [..., '-i', 'frames/%04d.png', ..., 'output.mp4']);`, say: [
    '캡처 부분은 이게 거의 전부입니다. Playwright로 크롬을 열고, 프레임 수만큼 돌면서 그림을 받아 파일로 저장합니다.',
    '마지막에 ffmpeg 한 번이면 영상이 됩니다. 도구는 전부 무료입니다. Node.js, Playwright, 크롬, ffmpeg면 충분합니다.',
  ] },
  { type: 'points', kicker: '02 · 파이프라인', title: '렌더 시간', points: ['48초 쇼릴 → 약 3분', '20초 홍보 영상 → 약 1분', '로컬 Mac 한 대에서'], say: [
    '렌더 시간도 생각보다 짧습니다. 48초짜리 쇼릴이 약 3분, 20초짜리 홍보 영상이 약 1분 걸렸습니다.',
    '전부 제 Mac에서 돌렸습니다.',
  ] },

  { type: 'cover', title: '8가지 스타일', sub: '모션그래픽 · 수채화 · 3D · 셰이더 · 키네틱 타이포 · React UI · 데이터 · 픽셀아트',
    bg: { clip: REEL, from: 0, len: 48 }, say: [
    '그럼 이 방식으로 어떤 그림까지 되는지, 스타일 여덟 개를 만들어 봤습니다. 전부 6초씩입니다.',
  ] },
  style(0, '모션그래픽 — Canvas 2D', ['첫 번째는 모션그래픽입니다. 캔버스 2D로 점 서른여섯 개가 원, 격자, 파도로 모양을 바꿉니다.', '가장 기본이지만, 로고 인트로 같은 데는 바로 쓸 수 있는 수준입니다.']),
  style(1, '수채화 — p5.js', ['두 번째는 수채화입니다. p5.js로 물감이 번지는 느낌을 냈습니다.', '앞에서 본 뮤직비디오도 p5.js로 그렸습니다.']),
  style(2, '3D — Three.js', ['세 번째는 3D입니다. Three.js로 매듭 모양 물체와 구슬에 조명과 그림자를 넣었습니다.', '헤드리스 크롬에서도 WebGL이 돌아가게 설정만 잡아 주면 됩니다.']),
  style(3, '셰이더 — WebGL GLSL', ['네 번째는 셰이더입니다. 픽셀 하나하나의 색을 GPU 코드로 계산해서, 대리석 같은 유체 무늬를 만들었습니다.']),
  style(4, '키네틱 타이포 — HTML/CSS', ['다섯 번째는 키네틱 타이포그래피입니다. 글자 하나하나의 위치와 투명도를 시간의 함수로 움직입니다.', '글자가 깨지지 않는다는 게 이 방식의 큰 장점입니다.']),
  style(5, '앱 UI 데모 — React', ['여섯 번째는 앱 화면입니다. 실제 React 컴포넌트에 프레임 번호로 계산한 상태 값을 넣어서 렌더합니다.', '앱 소개 영상에 특히 쓸모가 있습니다.']),
  style(6, '데이터 애니메이션 — D3', ['일곱 번째는 데이터 차트입니다. D3로 막대가 순위대로 자리를 바꿉니다.', '화면에 적힌 것처럼, 여기 숫자는 예시 데이터입니다.']),
  style(7, '픽셀아트 — Canvas 160×90', ['마지막은 픽셀아트입니다. 160×90 캔버스에 그리고 크게 키웠습니다.', '브라우저 폰트는 뭉개져서, 점수 글자는 비트맵 폰트를 직접 그렸습니다.', '여기까지 여덟 개가 전부 같은 렌더 스크립트 하나로 나왔습니다.']),

  { type: 'cover', title: '실제 앱 홍보 영상 3편', sub: '레포에 있는 브랜드 색 · 로고 · 폰트 · 스토어 문구만으로', say: [
    '스타일 데모는 결국 데모입니다. 그래서 실제 서비스 중인 앱 세 개로 홍보 영상을 만들어 봤습니다.',
    '조건은 하나였습니다. 각 앱 레포에 있는 브랜드 색, 로고, 폰트, 스토어 캡처만 쓰고,',
    '문구도 레포에 있는 문장만 쓰는 겁니다.',
  ] },
  { type: 'trio', kicker: '04 · 홍보 영상', title: '세로 20초 × 3편', items: [
      { clip: `${L}/clips/blurry`, label: '블러리' },
      { clip: `${L}/clips/morning`, label: '모닝콜' },
      { clip: `${L}/clips/runner`, label: '모두의 러너' }], say: [
    '결과는 이렇습니다. 세로 20초짜리 세 편입니다.',
    '소개팅 앱 블러리, 캐릭터가 목소리로 깨워 주는 알람 앱 모닝콜, 그리고 러닝 앱 모두의 러너입니다.',
    '앱마다 분위기가 완전히 다르게 나왔는데, 레포에서 찾은 색과 폰트를 그대로 썼기 때문입니다.',
  ] },
  { type: 'side', kicker: '04 · 블러리', title: '대화할수록 선명해지는 얼굴', clip: `${L}/clips/blurry`, from: 8.6, len: 3.8, pp: true,
    points: ['CSS blur 34px → 0', '폰트: 레포의 BlurryEditorial', '문구: 스토어 원문'], say: [
    '블러리는 마음이 통할수록 상대 얼굴이 조금씩 선명해진다는 앱입니다.',
    'CSS 블러 값을 34px에서 0으로 줄여서 그걸 그대로 보여 줬습니다.',
    '폰트도 레포에 들어 있던 전용 폰트를 가져다 썼습니다.',
  ] },
  { type: 'side', kicker: '04 · 모닝콜', title: '진짜 목소리로 깨워 주는 알람', clip: `${L}/clips/morning`, from: 4, len: 16,
    points: ['알람 링 · 음성 파형: CSS transform', '알람음 · 벨소리: 코드로 합성', '캐릭터: 레포의 원본 이미지'], say: [
    '모닝콜은 캐릭터가 진짜 목소리로 깨워 주는 앱입니다.',
    '알람 링과 음성 파형은 CSS 트랜스폼으로 움직였고, 알람음과 벨소리도 코드로 합성했습니다.',
  ] },
  { type: 'side', kicker: '04 · 모두의 러너', title: '지도 위에 그려지는 경로', clip: `${L}/clips/runner`, from: 3, len: 17,
    points: ['경로 애니메이션: SVG', '성과 수치: 보도자료 원문', '러닝 화면 숫자는 예시 (화면에 표기)'], say: [
    '모두의 러너는 지도 위에 경로가 그려지는 장면을 SVG로 새로 그렸습니다.',
    '성과 수치는 보도자료 원문에 있는 숫자만 썼고,',
    '러닝 화면의 거리와 페이스는 예시 값이라서 화면에 예시라고 적어 두었습니다.',
  ] },

  { type: 'points', kicker: '05 · 평가', title: '잘하는 것', points: ['글자 · 자막 · 로고가 깨지지 않는다', '스타일 폭이 넓다 — 2D부터 3D, 실제 UI까지', '수정은 코드 한 줄, 결과는 항상 같다', '실제 제품 화면 · 브랜드 에셋을 그대로 쓴다'], say: [
    '이제 평가입니다. 먼저 잘하는 것.',
    '첫째, 글자가 깨지지 않습니다. 생성형 영상 AI가 가장 약한 부분이 글자인데, 여기서는 폰트로 그대로 찍힙니다.',
    '둘째, 스타일 폭이 넓습니다. 2D 모션부터 3D, 셰이더, 실제 React 화면, 데이터 차트까지 전부 됐습니다.',
    '셋째, 수정이 쉽습니다. 색 하나 바꾸는 건 코드 한 줄이고, 다시 렌더해도 결과가 똑같이 나옵니다.',
    '넷째, 실제 제품 화면과 브랜드 에셋을 그대로 쓸 수 있습니다. 홍보 영상에서는 이게 제일 컸습니다.',
  ] },
  { type: 'points', kicker: '05 · 평가', title: '약한 것', points: ['실사 사람 · 자연 장면은 새로 못 만든다', '"알아서 완벽"하지 않다 — 영상마다 1~2회 수정'], say: [
    '약한 것도 분명합니다. 실사 사람이나 자연 풍경을 새로 만들지는 못합니다.',
    '이런 건 생성형 모델로 소스를 만들고, 코드로 편집하는 조합이 맞습니다.',
    '그리고 알아서 완벽하게 나오지는 않습니다. 영상마다 프레임을 직접 보고 고치는 과정이 한두 번씩 필요했습니다.',
  ] },
  { type: 'points', kicker: '05 · 평가', title: '에러 없이 돌았는데 틀린 것들', points: ['장면 전환 때 제목 두 개가 0.2초 겹침', '폰 캡처가 틀 안에서 잘려 보임', '알람 링이 시계 숫자를 가림', '출처에 없는 내용을 붙임 → 원문 대조 후 삭제'], say: [
    '실제로 잡은 것들입니다. 전부 에러 메시지 없이 멀쩡하게 렌더된 상태였습니다.',
    '장면이 바뀔 때 제목 두 개가 0.2초 겹치거나, 폰 화면이 잘리거나, 알람 링이 시계 숫자를 가렸습니다.',
    '가장 조심할 건 마지막입니다. 출처에 없는 내용을 그럴듯하게 붙인 적이 있어서, 원문과 대조해서 지웠습니다.',
    '그래서 렌더한 뒤에는 장면 중간과 경계 프레임을 모아서 꼭 눈으로 확인합니다.',
  ] },
  { type: 'points', kicker: '05 · 평가', title: '정리', points: ['글자 · 데이터 · 실제 UI가 중요한 영상 → 코드 렌더', '실사 장면이 필요하면 → 생성형 AI와 섞어 쓰기'], say: [
    '정리하면, 글자와 데이터, 실제 UI가 중요한 영상은 코드 렌더가 압도적으로 편합니다.',
    '실사 장면이 필요하면 생성형 AI와 섞어 쓰는 게 맞습니다.',
  ] },

  { type: 'image', kicker: '06 · 직접 해보려면', title: '코드는 전부 공개',
    image: `${L}/captures/repo-github.png`, source: 'github.com/hyperitycorp-jkh/tech-lectures', say: [
    '오늘 만든 코드는 GitHub에 공개했습니다. 렌더 도구와 장면 템플릿, 여덟 가지 스타일 코드가 들어 있습니다.',
    '앱 홍보 영상은 회사 자료라서 레포에는 빠져 있습니다.',
  ] },
  { type: 'code', kicker: '06 · 직접 해보려면', title: '필요한 것: Node.js · Chrome · ffmpeg', typeSeconds: 4, code:
`git clone https://github.com/hyperitycorp-jkh/tech-lectures
cd tech-lectures && npm i

# 강의 영상 템플릿 렌더 → toolkit/templates/out/longform.mp4
node toolkit/render.mjs toolkit/templates/longform.html

# 8가지 스타일 쇼릴
cd lectures/001-opus55-video-quality/scenes
npm i playwright-core three p5 d3 react@18 react-dom@18 htm
node reel.mjs`, say: [
    '따라 해 보려면 Node.js, 크롬, ffmpeg만 있으면 됩니다. 레포를 받고 렌더 명령 한 줄이면 템플릿 영상이 나옵니다.',
    '레포에는 Claude Code용 스킬도 들어 있어서, 이 폴더에서 원하는 영상을 말로 설명하면',
    '장면 코드부터 렌더와 검수까지 같은 흐름으로 진행합니다.',
  ] },
  { type: 'cover', title: '영상 = 그림 N장', sub: 'github.com/hyperitycorp-jkh/tech-lectures', say: [
    'AI에게 영상을 그리는 코드를 짜게 한다. 오늘 내용은 이 한 문장입니다.',
    '다음 영상에서는 또 다른 새 기술을 직접 테스트해 보겠습니다. 감사합니다.',
  ] },
] };
