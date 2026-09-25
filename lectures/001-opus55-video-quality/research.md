# 조사 메모 · Opus 5.5 영상 제작 (2026-09-25)

## 핵심 사실
- Opus 5.5는 영상을 직접 출력하지 않는다. 영상을 그리는 프로그램을 작성하고, 로컬에서 렌더한 프레임을 ffmpeg가 묶는다.
- 2026-09-22 출시 당일 공개된 뮤직비디오 "I'm Upping My P(doom)"는 p5.js + p5.brush로 프레임을 그리고, Node 스크립트가 헤드리스 Chrome으로 캡처, ffmpeg로 인코딩했다. 사람은 캐릭터 디자인과 "가사마다 재미있는 비주얼·전환"만 지시했다.
- 제품 홍보 영상 스킬(guizang-product-video-skill): 범위 정의 → 실제 출시 기능 확인 → 스토리보드 → 모션 → 오디오 합성 → 검증의 6단계. 기본 45~60초 가로.

## 출처
- [PDoomVideo (GitHub)](https://github.com/JohnHeibel/PDoomVideo) — 캡처: `captures/pdoom-github.png`
- [Claude Opus 5.5 Product Video Skill — OrcaRouter](https://www.orcarouter.ai/blog/claude-opus-5-5-product-video-skill)
- [What "Plan a Video" Actually Produces — OrcaRouter](https://www.orcarouter.ai/blog/claude-opus-5-5-video-plan-one-shot)
- [Code-Rendered AI Film — OrcaRouter](https://www.orcarouter.ai/blog/claude-opus-5-5-code-rendered-ai-history-film)
- [YouTube: I Asked Claude Opus 5.5 to Make This Video](https://www.youtube.com/watch?v=hKztrJbDGpA)
