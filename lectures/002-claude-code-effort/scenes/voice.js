// 002 공용 음성 설정 — longform·shorts 대본이 같이 쓴다 (toolkit/tts.mjs). 장면에서 대본보다 먼저 불러온다.
// VoiceDesign D2 (남성 발표자, 2026-09-26 사용자 선택)
window.VOICE = { VOICE_ENGINE: 'qwen', VOICE_MODEL: 'mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-8bit',
  VOICE_INSTRUCT: '30대 한국인 남성 발표자. 맑고 따뜻한 목소리, 표준어. 제품 키노트처럼 여유 있지만 에너지가 느껴지고, 문장 끝을 힘 있게 올려 설득한다. 경쾌한 속도.', VOICE_SPEED: 1 };

// 자막은 원래 표기, 음성은 한글 발음으로 읽게 바꾼다 (긴 것부터)
window.SAY_MAP = [
  ['Claude Code', '클로드 코드'], ['Claude', '클로드'], ['Opus 5.5', '오퍼스 오점오'], ['Fable 5.1', '페이블 오점일'],
  ['/effort', '슬래시 에포트'], ['effort', '에포트'], ['xhigh', '엑스하이'], ['medium', '미디엄'], ['high', '하이'], ['low', '로우'], ['max', '맥스'],
  ['HTML', '에이치티엠엘'], ['59개에서 24개로', '쉰아홉 개에서 스물네 개로'], ['Terminal-Bench', '터미널 벤치'], ['AI', '에이아이'],
];
window.toSay = s => SAY_MAP.reduce((a, [k, v]) => a.split(k).join(v), s);
