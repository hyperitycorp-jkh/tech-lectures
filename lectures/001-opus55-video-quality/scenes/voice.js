// 001 공용 음성 설정 — longform·shorts 대본이 같이 쓴다 (toolkit/tts.mjs). 장면에서 대본보다 먼저 불러온다.
// 샘플 A 선택: 밝고 귀엽게
window.VOICE = { VOICE_ENGINE: 'qwen', VOICE: 'Sohee', VOICE_INSTRUCT: '밝고 귀엽고 에너지 넘치는 톤, 살짝 웃으면서 말하듯이', VOICE_SPEED: 1.15 };

// 자막은 원래 표기, 음성은 한글 발음으로 읽게 바꾼다 (긴 것부터)
window.SAY_MAP = [
  ['Claude Code', '클로드 코드'], ['Claude', '클로드'], ['Opus 5.5', '오퍼스 오점오'],
  ['Node.js', '노드 제이에스'], ['p5.js', '피파이브 제이에스'], ['Three.js', '쓰리 제이에스'], ['GPU', '지피유'],
  ['React', '리액트'], ['D3', '디쓰리'], ['SVG', '에스브이지'], ['HTML', '에이치티엠엘'],
  ['MP4', '엠피포'], ['PNG', '피엔지'], ['ffmpeg로', '에프에프엠펙으로'], ['ffmpeg가', '에프에프엠펙이'], ['ffmpeg', '에프에프엠펙'], ['Chrome', '크롬'],
  ['GitHub', '깃허브'], ['AI', '에이아이'], ['34px', '34픽셀'], ['2D', '투디'], ['3D', '쓰리디'],
];
window.toSay = s => SAY_MAP.reduce((a, [k, v]) => a.split(k).join(v), s);
