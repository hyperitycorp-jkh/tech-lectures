// 세븐틴 매드무비 — SEVENTEEN 공식 'Anyone' 스페셜 비디오(CC BY 3.0, 위키미디어 공용 4K 파일)를 박자에 맞춰 편집
// 소스: media/anyone-4k.webm (commons.wikimedia.org/wiki/File:(SPECIAL_VIDEO)_SEVENTEEN(세븐틴)_-_Anyone.webm)
// 음악: 같은 영상의 곡 2:12.32~2:29.77 (110 BPM, 8마디) → anyone-cut.m4a. 2마디(브레이크) 다음 3마디 첫 박이 드롭
// 프레임: clips/svt = 131.32초부터 30fps(곡 시작보다 1초 앞) → 곡과 춤이 맞도록 마디 i 는 from = 30 + i × 65.45
// 누끼: cutout --mode both (13명 원경은 사람 분할이 비어서 피사체 마스크로 채움)
window.MAD = {
  size: 'h', bpm: 110, title: 'ANYONE', music: 'anyone-cut.m4a',
  theme: { palette: ['#e10600', '#15151a', '#f2b705', '#1f4bd8'], accent: '#e10600', bg: '#0b0b0e', outroGlow: '#3a0a0a' },
  clips: { svt: { dir: 'clips/svt', cut: 'clips/svt-cut' } },
  bars: [
    { fx: 'letters', clip: 'svt', from: 30, jump: 0 },
    { fx: 'riser', clip: 'svt', from: 95 },
    { fx: 'pop', clip: 'svt', from: 161 },
    { fx: 'echo', clip: 'svt', from: 226, caps: ['열세 명', '한 몸처럼'] },
    { fx: 'cuts', clips: ['svt'], froms: [292], zooms: [1, 1.4] },
    { fx: 'behind', clip: 'svt', from: 357, caps: ['칼군무', '세븐틴'] },
    { fx: 'letterbox', clip: 'svt', from: 423 },
    { fx: 'outro', clip: 'svt', frame: 540 },
  ],
  credit: 'video: SEVENTEEN “Anyone” special video (CC BY 3.0) · edited',
};
