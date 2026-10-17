// 007 롱폼 대본 + 장면 구성 — "클로드 무료 마케팅 플러그인 3종으로 유튜브 채널 진단하기 — 직접 비교"
// 수치·출처는 research.md, 비교 결과 원문은 demo/results/*.md, 채널 데이터는 YouTube Analytics(2026-09-25~10-16)
// 구성: 훅 → 약속 → 도구 3종 → 설치·보안 → 실험 설정 → 시간·토큰 → 넷 다 같은 결론 → 도구별로 더해 준 것 3장 → 구독
//       → 추측을 실제 데이터로 확인 4장 → 그래서 뭘 깔까 → 통째로 깔면 생기는 일 → 다음 영상 예고 → 엔드카드
//   node lectures/007-marketing-plugins/scenes/timing.mjs
const L = '/lectures/007-marketing-plugins/captures';
const SRC_YT = 'YouTube Analytics · 바이브코더 채널 (2026-09-25 ~ 10-16)';

window.SCRIPT = { toSay: window.toSay, voice: window.VOICE, chapters: [
  { type: 'hook', kicker: 'Claude Code · 무료 플러그인', title: '마케팅 플러그인 3개\n깔고 내 유튜브 진단', hl: '3개', bg: `${L}/gh-sms.png`, say: [
    '클로드에 무료 마케팅 플러그인을 깔면, 내 유튜브 채널 진단을 얼마나 잘할까요?',
    '세 개를 직접 깔아서, 우리 채널 실제 데이터로 똑같은 일을 시켜 봤어요.',
  ] },
  { type: 'points', kicker: '이 영상에서', title: '끝까지 보시면', points: ['무료 플러그인 3개', '플러그인 없이 vs 3개', 'AI 추측 → 실제 데이터'], say: [
    '플러그인이 없을 때랑 비교해서, 뭐가 진짜 달라지는지 보여 드릴게요.',
    'AI가 추측한 걸 실제 유튜브 데이터로 확인한 결과도 있어요.',
  ] },
  { type: 'shot', kicker: '① 앤트로픽 공식', title: 'Marketing 플러그인', image: `${L}/gh-official.png`, source: 'github.com/anthropics/knowledge-work-plugins · Apache-2.0',
    points: ['앤트로픽이 만든 무료', '스킬 8개', '보고서 · 기획 · 이메일'], say: [
    '첫 번째는 앤트로픽이 직접 만든 마케팅 플러그인이에요. 스킬 8개로, 글 초안이랑 캠페인 기획, 성과 보고서를 만들어 줘요.',
  ] },
  { type: 'shot', kicker: '② 커뮤니티', title: 'Social Media Skills', image: `${L}/gh-sms.png`, source: 'github.com/social-media-skills/skills · MIT',
    points: ['스킬 106개', '쇼츠 · 썸네일 · 쓰레드', '무료'], say: [
    '두 번째는 Social Media Skills예요. 스킬이 106개나 되고, 유튜브 쇼츠랑 썸네일, 쓰레드 전용 스킬까지 있어요.',
  ] },
  { type: 'shot', kicker: '③ 커뮤니티', title: 'marketingskills', image: `${L}/gh-mks.png`, source: 'github.com/coreyhaines31/marketingskills · MIT · 별 5.5만',
    points: ['스킬 50개', '카피 · 심리학 · 앱스토어', 'GitHub 별 5.5만'], say: [
    '세 번째는 marketingskills예요. 카피라이팅이랑 마케팅 심리학, 앱스토어 최적화까지 50개, GitHub 별이 5만 개가 넘어요.',
  ] },
  { type: 'code', kicker: '설치', title: '명령어 한두 줄', typeSeconds: 4, code:
`# ① 앤트로픽 공식 Marketing
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install marketing@knowledge-work-plugins

# ② Social Media Skills  (클로드 코드 안에서)
/plugin marketplace add social-media-skills/skills
/plugin install social-media-skills@social-media-skills

# ③ marketingskills  (필요한 것만 골라서)
npx skills add coreyhaines31/marketingskills --skill copywriting`, say: [
    '설치는 이렇게 한두 줄이에요. 명령어는 설명란에 다 적어 둘게요.',
  ] },
  { type: 'points', kicker: '깔기 전에', title: '남이 만든 스킬은 먼저 읽어 보기', source: 'Anthropic 공식 문서 — Agent Skills · 보안', points: ['파일부터 읽어 보기', '위험한 명령 없음', '외부 API 도구 66개 (이번엔 안 씀)'], say: [
    '공식 문서도 남이 만든 스킬은 파일을 다 읽어 보고 쓰라고 해요.',
    '세 저장소를 검사해 보니 위험한 명령은 없었어요. marketingskills에는 외부 서비스를 부르는 도구 66개가 같이 들어 있는데, 키를 넣어야 돌아가서 이번엔 안 썼어요.',
  ] },
  { type: 'points', kicker: '실험', title: '같은 과제를 네 번', points: ['우리 채널 영상 23편', '진단 + 제목 다시 쓰기', '같은 과제 4번'], say: [
    '과제는 하나예요. 우리 채널 영상 23편 데이터를 주고, 조회수를 진단하고, 막힌 영상 네 편의 제목과 썸네일을 다시 쓰게 했어요.',
    '플러그인 없는 클로드까지 넣어서, 네 번 똑같이 돌렸어요.',
  ] },
  { type: 'bars', kicker: '결과 ①', title: '걸린 시간', unit: '분', max: 25, source: '같은 모델(Opus 5.5) · 같은 과제 · 2026-10-17', rows: [
    { label: '플러그인 없이', v: 15.6 }, { label: '공식 Marketing', v: 24.1 }, { label: 'Social Media Skills', v: 19.2 }, { label: 'marketingskills', v: 19.8 },
  ], note: '토큰 16만 → 23~25만', say: [
    '플러그인을 쓰면 스킬 파일을 먼저 읽느라, 시간은 1.2에서 1.5배, 토큰은 1.5배쯤 더 들었어요.',
  ] },
  { type: 'points', kicker: '결과 ②', title: '넷 다 같은 결론을 냈다', points: ['쇼츠 1,200회 벽', '39회 쇼츠 노출 문제', '롱폼 제목 · 썸네일 교체', '쇼츠 → 롱폼 연결'], say: [
    '그런데 흥미로운 건, 핵심 결론은 넷 다 똑같았어요.',
    '플러그인이 없어도, 데이터만 주면 클로드가 거기까지는 찾아요.',
  ] },
  { type: 'shot', kicker: '플러그인이 더해 준 것 · 공식 Marketing', title: '바로 쓰는 보고서 형식', image: `${L}/official-report.png`, source: 'demo/results/result-official-marketing.md',
    points: ['보고서 형식', '7일 뒤 목표: 49 → 60~75회'], say: [
    '차이는 형식이었어요. 공식 플러그인은 바로 쓸 수 있는 보고서를 만들고, 7일 뒤 목표치까지 범위로 잡아 줬어요.',
  ] },
  { type: 'thumbs', kicker: '플러그인이 더해 준 것 · Social Media Skills', title: '썸네일을 폰 크기로 검사', a: `${L}/thumb-006.png`, b: `${L}/thumb-006-mobile.png`, labelA: '원래 크기', labelB: '폰 화면 크기 (168×94)', note: '아래 글자 약 4px', say: [
    'Social Media Skills는 썸네일을 폰 크기로 줄여서 검사했어요.',
    '그랬더니 아래쪽 글자가 4픽셀로 줄어서 안 읽히고, 강아지가 재생 시간 자리를 가린다는 걸 짚었어요.',
  ] },
  { type: 'points', kicker: '플러그인이 더해 준 것 · marketingskills', title: '왜 통했는지 이름을 붙여 준다', points: ['앵커링', '지식의 저주', '업로드 0인 날 12일'], say: [
    'marketingskills는 마케팅 심리학으로 이유를 설명해요. 잘 된 썸네일은 비싼 가격에 줄을 긋고 싼 가격을 보여 준 앵커링이래요.',
    '그리고 우리가 놓친 가장 큰 문제로 업로드 공백을 꼽았어요. 21일 중 12일은 올린 영상이 하나도 없었어요.',
  ] },
  { type: 'cover', title: '도움 됐다면 구독!', sub: '클로드로 직접 해 보고, 계속 정리할게요', say: [
    '여기까지 도움 됐다면, 구독 한 번 눌러 주세요.',
  ] },
  { type: 'verify', kicker: '확인', title: 'AI의 추측, 실제 데이터로', source: SRC_YT, rows: [
    { claim: '쇼츠는 며칠 만에 멈춘다', fact: '첫 이틀에 98~100%' },
    { claim: '39회 쇼츠, 노출 막힘?', fact: '쇼츠 피드 0회' },
    { claim: '조회수 ≠ 본 사람', fact: '실제로 본 건 26%' },
    { claim: '롱폼은 검색 덕?', fact: '검색 91%' },
  ], say: [
    '그럼 AI가 추측이라고 적은 것들, 맞았을까요? 유튜브 분석 데이터를 열어서 확인해 봤어요.',
    '쇼츠는 조회수의 거의 전부가 첫 이틀에 들어왔어요. 39회짜리 쇼츠는 쇼츠 피드에 한 번도 안 실렸고요.',
    '1,200회짜리 쇼츠도 실제로 본 건 4분의 1 정도였고, 잘 된 롱폼은 91%가 검색으로 들어왔어요.',
    '네 가지 모두 데이터와 맞아떨어졌어요.',
  ] },
  { type: 'points', kicker: '정리', title: '그래서 뭘 깔까', points: ['유튜브 · 쓰레드 → Social Media Skills', '카피 · 앱스토어 → marketingskills', '보고서 → 공식 Marketing'], say: [
    '정리하면, 유튜브랑 쓰레드는 Social Media Skills, 카피랑 앱스토어는 marketingskills, 보고서는 공식 플러그인이에요.',
    '진단만 할 거면, 데이터만 잘 주면 플러그인 없이도 충분했어요.',
  ] },
  { type: 'bars', kicker: '주의', title: '통째로 깔면, 스킬 설명만', unit: '자', max: 100000, source: '세 저장소 SKILL.md 앞부분(이름·설명) 글자 수 합 · 공식 문서: 시작할 때 항상 불러옴', rows: [
    { label: '공식 Marketing (8개)', v: 2720 }, { label: 'marketingskills (50개)', v: 39541 }, { label: 'Social Media Skills (106개)', v: 98603 },
  ], note: '필요한 것만 골라서', say: [
    '하나 주의할 점이 있어요. 스킬 이름이랑 설명은 대화를 시작할 때마다 항상 같이 읽혀요.',
    '106개를 통째로 깔면 설명만 약 10만 자예요. 필요한 것만 골라서 까는 게 좋아요.',
  ] },
  { type: 'points', kicker: '다음 영상', title: '처방대로 바꿔 보면?', points: ['제목 · 썸네일 교체', '막힌 쇼츠 다시', '일주일 뒤 비교'], say: [
    '다음 영상에서는, 이 처방대로 실제로 바꿔 볼게요. 제목이랑 썸네일, 막힌 쇼츠의 첫 1초까지요.',
    '일주일 뒤에 숫자가 어떻게 달라졌는지 보여 드릴게요.',
  ] },
  { type: 'endcard', title: '다음 영상에서 만나요!', sub: '설명란 — 설치 명령어 · 비교 결과 원문', hold: 20, say: [
    '설치 명령어랑 네 가지 결과 원문은 설명란에 있어요. 다음 영상에서 만나요!',
  ] },
] };
