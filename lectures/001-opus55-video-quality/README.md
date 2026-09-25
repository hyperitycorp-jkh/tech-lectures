# 001 · Claude Opus 5.5로 만든 영상, 퀄리티는 어느 정도일까

> 영상 생성 AI 없이, Claude Opus 5.5가 짠 **코드만으로** 영상을 만들어 보고 결과를 평가한 기록 (2026-09-25)

## 무엇을 테스트했나
Opus 5.5 출시 직후 "Claude로 영상을 잘 만든다"는 이야기가 돌았다. 실제로는 MP4를 직접 만드는 게 아니라 **영상을 그리는 프로그램을 짜는 것**이다. 그 방식으로 어디까지 되는지 직접 만들어 봤다.

| # | 만든 것 | 규격 | 결과 |
|---|---|---|---|
| 1 | 파이프라인 설명 영상 | 16:9 · 12초 | [영상](https://storage.googleapis.com/hyperity-lecture-assets/opus-5.5/opus55-code-video.mp4) |
| 2 | 8가지 스타일 쇼릴 (모션그래픽·수채화·3D·셰이더·키네틱 타이포·React UI·D3·픽셀아트) | 16:9 · 48초 | [영상](https://storage.googleapis.com/hyperity-lecture-assets/opus-5.5/opus55-style-reel.mp4) |
| 3 | 실제 앱 홍보 영상 3편 (브랜드 에셋·스토어 문구 사용) | 9:16 · 20초 | [블러리](https://storage.googleapis.com/hyperity-lecture-assets/opus-5.5/promo/blurry.mp4) · [모닝콜](https://storage.googleapis.com/hyperity-lecture-assets/opus-5.5/promo/morning.mp4) · [모두의 러너](https://storage.googleapis.com/hyperity-lecture-assets/opus-5.5/promo/runner.mp4) |
| 4 | 강의 요약 영상 (쇼릴·홍보 영상을 화면 안에서 재생) | 16:9 · 60초 | [영상](https://storage.googleapis.com/hyperity-lecture-assets/opus-5.5/promo/lecture.mp4) |
| 5 | **롱폼 강의** (결과 몽타주 → 원리 → 파이프라인 → 8가지 스타일 → 홍보 영상 → 평가·실수 3개 → 따라 하기, Qwen3-TTS 나레이션 + 말하는 캐릭터 아바타) | 16:9 · 8분 14초 | [영상](https://storage.googleapis.com/hyperity-lecture-assets/opus-5.5/longform.mp4) · [자막 SRT](https://storage.googleapis.com/hyperity-lecture-assets/opus-5.5/longform.srt) · [썸네일](https://storage.googleapis.com/hyperity-lecture-assets/opus-5.5/thumbnail.png) |

노션 강좌: 📚 강의 → 🎬 Opus 5.5 영상 — 코드로 영상 만들기 (1장 기술편 / 2장 활용편)

## 어떻게 만들었나
```
HTML 장면(renderFrame(f)) → 헤드리스 Chrome이 프레임마다 스크린샷 → ffmpeg로 MP4 + 코드로 합성한 오디오
```
- 도구는 전부 무료: Node.js, playwright-core, Chrome, ffmpeg, p5.js, Three.js, D3, React
- 렌더 시간: 48초 쇼릴 약 3분, 20초 홍보 영상 약 1분 (MacBook 로컬)

## 퀄리티 평가
**잘하는 것**
- 글자·자막·로고가 절대 깨지지 않는다 (생성형 영상 AI의 가장 큰 약점)
- 스타일 폭이 넓다: 2D 모션, 수채화, 3D, 셰이더, 실제 React UI, 데이터 차트, 픽셀아트
- 수정이 코드 한 줄, 같은 결과가 항상 재현된다
- 실제 제품 화면·브랜드 에셋을 그대로 쓸 수 있다

**약한 것**
- 실사 사람·자연 장면을 새로 만들지는 못한다 → 생성형 모델로 소스를 만들고 코드로 편집하는 조합
- "알아서 완벽"하지 않다. 매 영상마다 **프레임을 직접 보고 고치는 반복**이 1~2회 필요했다

## 실제로 고친 것 (프레임 검수로 발견)
| 영상 | 문제 | 해결 |
|---|---|---|
| 12초 설명 | 장면 전환 때 제목 두 개가 0.2초 겹침 | 구간을 겹치지 않게 |
| 쇼릴 | `roundRect` 음수 반지름 에러, favicon 404, 긴 ffmpeg 수식 실패 | `Math.max(0,r)`, 204 응답, 오디오를 Node에서 합성 |
| 쇼릴 | React UI 토스트가 제목을 가림, 픽셀아트 폰트 뭉개짐 | 위치 이동, 비트맵 폰트 |
| 블러리 | 폰 캡처가 중간에 잘려 보임, 로고 글자 중복 | 틀 높이, 엔드카드 정리 |
| 모닝콜 | 알람 링이 시계 숫자를 가림 | 레이어 순서 |
| 러너 | 단어 중간 줄바꿈, 출처에 없는 도시별 프로그램 표기 | 줄 나눔, **원문 대조 후 삭제** |

## 파일
- `scenes/longform.html`, `longform.script.js` — 롱폼 장면·대본. 대본을 고치면 `node lectures/001-opus55-video-quality/scenes/timing.mjs`로 나레이션 음성(Qwen3-TTS, 처음 한 번 `sh toolkit/tts/setup.sh`)·길이·입 모양을 다시 만든 뒤 `node toolkit/render.mjs lectures/001-opus55-video-quality/scenes/longform.html` (영상 소스는 버킷에서 받아 `toolkit/clip.mjs`로 `clips/`에 풀어야 함)
- `scenes/scene.html`, `scenes/render.mjs` — 12초 설명 영상
- `scenes/styles/01~08.html`, `scenes/reel.mjs` — 8가지 스타일 쇼릴 (원본 스크립트 그대로 보관)
  - 다시 렌더: `cd scenes && npm i playwright-core three p5 d3 react@18 react-dom@18 htm && node reel.mjs`
- `captures/` — 참고 자료화면
- `private/` — 앱 홍보 영상 장면·에셋, 강의 60초 장면 (회사 자료라 공개 레포에 포함하지 않음)
- `publish.md` — 유튜브 → 쇼츠/릴스 → 캐러셀 → 쓰레드 배포 문구
