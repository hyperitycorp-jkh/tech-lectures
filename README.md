# tech-lectures

새 기술을 **직접 테스트하고 응용해서 강의**로 만드는 레포입니다.
강의 영상은 영상 생성 AI 없이 **코드로 렌더**합니다 (HTML 장면 → 헤드리스 Chrome 캡처 → ffmpeg).

## 강의 목록
| # | 주제 | 유튜브 | 노션 | 코드 |
|---|---|---|---|---|
| 001 | Claude Opus 5.5로 만든 영상, 퀄리티는 어느 정도일까 | 롱폼 [영상](https://storage.googleapis.com/hyperity-lecture-assets/opus-5.5/longform.mp4) (유튜브 업로드 예정) | 📚 강의 → 🎬 Opus 5.5 영상 | [lectures/001-opus55-video-quality](lectures/001-opus55-video-quality) |

## 한 강의가 만들어지는 흐름
```
조사 → 결과물 상의 → 테스트·데모 → 구성안 → 자료화면 수집 → 장면 작성 → 렌더·검수·수정
   → 롱폼 → 쇼츠 → 캐러셀+릴스 → 쓰레드 → GitHub·노션 공유
```
Claude Code에서 이 폴더를 열고 "OO 테스트해서 강의 만들어줘"라고 하면 [`tech-lecture-video` 스킬](.claude/skills/tech-lecture-video/SKILL.md)이 이 흐름대로 진행합니다.

## 폴더
```
toolkit/                      → .claude/skills/tech-lecture-video/toolkit (심볼릭 링크)
  render.mjs                  장면 → MP4 (+ 나레이션·SRT) / --still 로 PNG
  capture.mjs                 웹페이지 스크린샷·화면 녹화 (자료화면·결과화면)
  clip.mjs                    결과 영상을 PNG 시퀀스로 풀어 장면 안에서 재생
  templates/                  longform · shorts · thumbnail · carousel
lectures/NNN-주제/            강의 하나 = 폴더 하나 (README · research · demo · captures · scenes · publish)
```

## 사용법
```bash
npm i
node toolkit/render.mjs lectures/001-opus55-video-quality/scenes/longform.html     # 롱폼
node toolkit/render.mjs <path>/thumbnail.html --still                              # 썸네일
node toolkit/render.mjs <path>/carousel.html --still --query slide=1               # 캐러셀 1장
node toolkit/capture.mjs shot https://example.com lectures/NNN/captures/ref.png     # 자료화면
node toolkit/clip.mjs result.mp4 lectures/NNN/clips/result                         # 결과 영상 → 장면용
```
필요: Node.js 20+, ffmpeg, Google Chrome, (나레이션) macOS `say`

영상 파일은 git에 넣지 않고 `gs://hyperity-lecture-assets`에 올린 뒤 링크만 둡니다.
