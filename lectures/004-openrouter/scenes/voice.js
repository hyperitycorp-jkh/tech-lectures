// 004 공용 음성 설정 — longform·shorts 대본이 같이 쓴다 (toolkit/tts.mjs). 장면에서 대본보다 먼저 불러온다.
// 목소리 고정: D2(남성 키노트 톤, 사용자 선택)를 기준 음성으로 복제 — 줄마다 목소리가 바뀌지 않게 (002 교훈)
window.VOICE = { VOICE_ENGINE: 'qwen', VOICE_REF: '~/.local/share/qwen-tts/voices/d2-keynote.wav', VOICE_SPEED: 1 };

// 자막은 원래 표기, 음성은 한글 발음으로 읽게 바꾼다 (긴 것부터)
window.SAY_MAP = [
  ['Claude Opus 5.5', '클로드 오퍼스 오점오'], ['Claude Haiku 4.5', '클로드 하이쿠'], ['Claude', '클로드'], ['OpenRouter', '오픈 라우터'],
  ['DeepSeek V4.1 Flash', '딥시크 플래시'], ['DeepSeek', '딥시크'], ['GPT', '지피티'], ['OpenAI', '오픈에이아이'], ['SDK', '에스디케이'],
  ['API', '에이피아이'], ['1,000번', '천 번'], ['3,000', '삼천'], ['1.4원', '일 점 사 원'], ['230원', '이백삼십 원'], ['2만 원', '이만 원'],
  ['0.6', '영 점 육'], ['109', '백구'], ['100조', '백조'], ['52%', '오십이 퍼센트'], ['90배', '구십 배'], ['AI', '에이아이'],
];
window.toSay = s => SAY_MAP.reduce((a, [k, v]) => a.split(k).join(v), s);
