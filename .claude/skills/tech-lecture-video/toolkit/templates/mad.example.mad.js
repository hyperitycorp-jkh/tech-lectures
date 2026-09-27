// 매드무비 설정 예시 — mad.html 이 ?c= 없이 열리면 이 파일을 읽는다. 강의에서는 scenes/<이름>.mad.js 로 복사해 고친다.
// 마디(4박)마다 fx 하나. 쓸 수 있는 fx: letters hook riser pop echo cuts behind letterbox phone blur route pulse cards outro
// clips: { 이름: { dir: 'clips/x'(jpg 프레임), cut: 'clips/x-cut'(누끼 png), from: 시작 프레임 } } — toolkit/clip.mjs · toolkit/cutout.swift 로 만든다
window.MAD = {
  size: 'h',                    // 'h' 1920×1080 | 'v' 1080×1920
  bpm: 128,                     // 음악 파일을 쓰면 music: '곡.mp3' + 그 곡의 BPM
  title: 'MOVE',                // 영문 6자 이하
  theme: { palette: ['#ff2d6f', '#16e0bd', '#ffd400', '#7c4dff'], bg: '#07030c', accent: '#ff2d6f' },
  clips: {},
  bars: [
    { fx: 'hook', words: ['영상', '편집', '어려워?', '이렇게'] },
    { fx: 'hook', words: ['박자에', '맞춰', '자르고', '얹기'] },
    { fx: 'phone', screens: ['/toolkit/templates/sample-right.svg'], caps: ['앱 화면', '박자마다'] },
    { fx: 'route', caps: ['지도 경로', '그리기'] },
    { fx: 'pulse', icon: '⏰', caps: ['목소리', '파형'] },
    { fx: 'phone', screens: ['/toolkit/templates/sample-left.svg', '/toolkit/templates/sample-right.svg'] },
    { fx: 'hook', words: ['설정', '하나로', '스타일', '바꾸기'] },
    { fx: 'outro', title: 'MAD' },
  ],
};
