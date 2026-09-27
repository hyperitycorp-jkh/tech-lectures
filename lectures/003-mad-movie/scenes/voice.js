// 003 공용 음성 설정 — longform·shorts 대본이 같이 쓴다 (toolkit/tts.mjs). 장면에서 대본보다 먼저 불러온다.
// 목소리 고정: D2(남성 키노트 톤, 사용자 선택)를 기준 음성으로 복제 — 줄마다 목소리가 바뀌지 않게 (002 교훈)
window.VOICE = { VOICE_ENGINE: 'qwen', VOICE_REF: '~/.local/share/qwen-tts/voices/d2-keynote.wav', VOICE_SPEED: 1 };

// 자막은 원래 표기, 음성은 한글 발음으로 읽게 바꾼다 (긴 것부터)
window.SAY_MAP = [
  ['Claude Code', '클로드 코드'], ['Claude', '클로드'], ['Opus 5.5', '오퍼스 오점오'], ['오푸스 5.5', '오퍼스 오점오'], ['오푸스', '오퍼스'],
  ['Mixkit', '믹스킷'], ['Vision', '비전'], ['BPM', '비피엠'], ['360장', '삼백육십 장'], ['25초', '이십오 초'], ['128', '백이십팔'],
  ['32박', '서른두 박'], ['15초', '십오 초'], ['AI', '에이아이'],
];
window.toSay = s => SAY_MAP.reduce((a, [k, v]) => a.split(k).join(v), s);
