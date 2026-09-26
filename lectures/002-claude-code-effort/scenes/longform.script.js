// 002 롱폼 대본 + 장면 구성. 수치는 research.md (원문: claude.dev/blog/spending-your-effort, 2026-09-25) 기준.
// 구성: effort 곡선 + 약속(훅, 썸네일과 같은 문구) → 약속 → 출처 → 01 effort란 → 02 어려운 일 → 구독 → 03 언제 뭘 → 04 실전 루프 → /effort → 엔드카드
//   node lectures/002-claude-code-effort/scenes/timing.mjs   (대본을 고치면 다시 실행, 고친 줄만 새로 생성)
// 챕터 종류: curve(effort 곡선, curve.js) · duo(두 결과 나란히) · cover · points · code · image · bars(막대) · stat(큰 숫자 전→후) · endcard
const L = '/lectures/002-claude-code-effort';
const SRC = 'claude.dev/blog/spending-your-effort (원문 내부 실행 기준)';

window.SCRIPT = { toSay: window.toSay, voice: window.VOICE, chapters: [
  { type: 'curve', hook: true, only: ['Opus 5.5', 'Fable 5.1'], kicker: 'Claude Code', title: 'effort, 제대로 정리해드릴게요', source: 'Terminal-Bench 3.0 · 원문 그래프 재구성(근삿값)', say: [
    '클로드 코드 effort, low로 두세요, 아니면 max로 두세요?',
    '올릴수록 점수는 오르는데, 토큰도 같이 올라가요. 언제 뭘 써야 하는지, 제대로 정리해 드릴게요.',
  ] },
  { type: 'points', kicker: '이 영상에서', title: '끝까지 보시면', points: ['effort가 정확히 뭔지', '언제 어떤 단계를 쓰는지 — low · medium · high · max', '클로드 코드 팀이 쓰는 작업 순서'], say: [
    '오늘은 effort가 정확히 뭔지, 언제 어떤 단계를 써야 하는지 정리해 드릴게요.',
    '마지막엔 클로드 코드 팀이 실제로 쓰는 작업 순서도 알려 드릴게요.',
  ] },
  { type: 'image', kicker: '출처', title: 'Using Claude Code: Spending your effort', image: `${L}/captures/blog.png`, source: 'claude.dev/blog/spending-your-effort', say: [
    '내용은 클로드 코드 팀이 며칠 전에 올린 글이 바탕이에요.',
    'Opus 5.5와 Fable 5.1로 직접 실험하고, 벤치마크를 파고든 글이에요.',
  ] },

  { type: 'points', kicker: '01 · effort란', title: '얼마나 공들일지 알려 주는 신호', points: ['1시간 주면 → 쓸 만한 최선본, 이어서 고치기', '12시간 주면 → 끝까지 파고들기', '높을수록 → 스스로 판단 · 검증을 더 많이'], say: [
    'effort는, 이 일에 얼마나 공을 들일지 클로드에게 알려 주는 신호예요.',
    '누가 한 시간 줄 테니 해 달라고 하면, 일단 쓸 만한 걸 내고 같이 고쳐 가잖아요.',
    '열두 시간을 주면 끝까지 파고들겠죠. effort가 딱 그거예요.',
    '높을수록 클로드가 스스로 판단하고, 검증과 예외 테스트를 더 많이 해요.',
  ] },
  { type: 'curve', kicker: '01 · effort란', title: '올릴수록 점수도, 토큰도 오른다', only: ['Opus 5.5', 'Fable 5.1'], half: true, source: 'Terminal-Bench 3.0 · 원문 그래프 재구성(근삿값)', say: [
    '벤치마크로 보면, 단계를 올릴 때마다 통과율과 토큰이 같이 올라가요.',
    '그리고 Opus 5.5는 high만으로도, Fable 5.1 max와 비슷한 점수를 절반쯤 되는 토큰으로 냈어요.',
  ] },
  { type: 'bars', kicker: '01 · effort란', title: '"운동 기록 앱 만들어줘" — 걸린 시간', unit: '분', max: 67, source: SRC,
    rows: [{ label: 'low', v: 1.5 }, { label: 'medium', v: 4 }, { label: 'high', v: 11 }, { label: 'max', v: 67 }], say: [
    '원문에서는 운동 기록 앱을 만들어 달라고, 딱 한 줄만 줬대요.',
    'low는 1분 반 만에 기록과 그래프만, max는 67분 동안 히트맵까지 만들었어요.',
    '대충 시킬수록, effort가 높으면 클로드가 대신 정하는 게 많아져요.',
  ] },
  { type: 'points', kicker: '01 · effort란', title: '명세를 자세히 주면?', points: ['단계별 결과가 비슷해진다', '차이는 디테일과 정리 정도', '→ 명세가 좋으면 effort 차이가 줄어든다'], say: [
    '반대로, 인터뷰로 자세한 명세를 만들어서 주면요,',
    '단계별 결과가 꽤 비슷해졌대요. 명세가 좋으면 effort 차이가 줄어드는 거죠.',
  ] },

  { type: 'cover', title: '어려운 일에선?', sub: '결과가 "되냐 안 되냐"로 갈릴 때', say: [
    '그럼 진짜 어려운 일에선 어떨까요?',
  ] },
  { type: 'stat', kicker: '02 · 어려운 일', title: 'HTML 정화기 과제 · Fable 5.1', from: '1/5', to: '5/5', fromLabel: 'low · 약 2분', toLabel: 'high 이상 · 약 33분', source: SRC, say: [
    '웹페이지에 자바스크립트를 몰래 숨기는 방법을, 전부 걸러내는 과제가 있어요.',
    'low는 2분 만에 한 번에 짜고, 테스트 페이지 하나로 끝냈어요. 다섯 번 중 한 번 성공.',
    'high는 33분 동안 자기 코드를 공격해 보고, 테스트 모음을 돌리고, 퍼저까지 짰어요. 다섯 번 다 성공했죠.',
  ] },
  { type: 'bars', kicker: '02 · 어려운 일', title: '분야별 통과율 low → top · Fable 5.1', unit: '%', max: 100, source: SRC + ' · Terminal-Bench 3.0',
    rows: [{ label: '보안', a: 64, v: 87 }, { label: '하드웨어', a: 34, v: 75 }, { label: 'ML', a: 54, v: 73 }, { label: '과학', a: 41, v: 61 },
      { label: '소프트웨어', a: 43, v: 56 }, { label: '미디어', a: 18, v: 30 }, { label: '운영', a: 12, v: 22 }], say: [
    '분야별로 보면 차이가 뚜렷해요.',
    '보안이나 하드웨어처럼 예외 상황이 많은 분야는 크게 오르고,',
    '운영처럼 정해진 규칙을 따르는 일은 별로 안 올라요.',
  ] },
  { type: 'points', kicker: '02 · 어려운 일', title: '고쳐 주는 것, 못 고치는 것', source: SRC, points: ['놓친 예외 케이스 59 → 24', '통과 140 → 214 (370번 시도 중)', '토큰은 약 3배 (73k → 222k)', '접근법이 틀린 건 effort로 못 고친다'], say: [
    'Fable 5.1을 low에서 max로 올리니까, 놓친 예외 케이스가 59개에서 24개로 줄었어요.',
    '대신 토큰은 세 배쯤 더 썼고요.',
    '그리고 중요한 거. 접근법 자체가 틀린 건, effort를 올려도 안 고쳐져요.',
  ] },

  { type: 'cover', title: '도움 됐다면 구독!', sub: '클로드 코드, 직접 써 보고 계속 정리할게요', say: [
    '여기까지 도움 됐다면, 구독 한 번 눌러 주세요.',
  ] },
  { type: 'points', kicker: '03 · 언제 뭘 쓰나', title: '단계별 가이드', points: ['low — 브레인스토밍 · 스케치 · 쉬운 수정', 'medium — 대부분의 새 기능 개발', 'high — 버그 수정 · 검증이 중요한 일', 'max — 어려운 문제를 통째로 맡길 때'], say: [
    '정리하면 이래요. low는 빠르게 주고받을 때. 아이디어, 스케치, 쉬운 수정이요.',
    'medium은 대부분의 일반 개발. high는 기존 코드의 버그처럼, 검증이 중요한 일.',
    'max는 어려운 문제를 처음부터 끝까지 통째로 맡길 때예요.',
  ] },
  { type: 'points', kicker: '04 · 실전 루프', title: '새 기능 만들 때 순서', points: ['명세 주고 → 빠진 걸 인터뷰 받기', 'low로 구현', '방향 맞는지 검토 → low로 반복', '마지막 검증 · 테스트만 high'], say: [
    '글쓴이가 새 기능을 만들 때 쓰는 순서도 있어요.',
    '먼저 명세를 주고, 빠진 걸 인터뷰해 달라고 해요. 그다음 low로 빠르게 구현하고,',
    '방향이 맞는지 보면서 low로 고치다가, 마지막 검증만 high로 돌려요.',
  ] },
  { type: 'code', kicker: '05 · 바꾸는 법', title: '/effort 한 줄', typeSeconds: 3, code:
`# 클로드 코드 안에서 — 대화 중간에도 바꿀 수 있어요
/effort low
/effort high

# 터미널에서 시작할 때
claude --effort max`, say: [
    '바꾸는 법은 간단해요. 클로드 코드에서 /effort, 그리고 단계를 치면 돼요.',
    '대화 중간에 바꿔도 캐시가 안 깨져서, 부담 없이 올렸다 내렸다 하면 돼요.',
  ] },
  { type: 'endcard', title: '다음 영상에서 만나요!', sub: '설명란 — effort 치트시트 한 장', hold: 20, say: [
    '설명란에 effort 치트시트 한 장 올려 둘게요. 다음 영상에서 만나요!',
  ] },
] };
