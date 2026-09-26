# 002 · 클로드 코드 effort 제대로 정리 — 언제 low, 언제 max?

원문 [Using Claude Code: Spending your effort](https://claude.dev/blog/spending-your-effort/) (2026-09-25)를 바탕으로
effort가 뭔지, 단계별로 언제 쓰는지, 클로드 코드 팀이 쓰는 작업 순서를 정리한 가이드 영상.

- 롱폼: https://youtu.be/0E-1a-WjYiA
- 쇼츠: https://youtu.be/XyBIN_QmpNs · https://youtu.be/8ki7WyxVNJc
- 치트시트: https://storage.googleapis.com/hyperity-lecture-assets/claude-effort/cheatsheet.png

## 파일

- `research.md` 원문 요약과 수치 (내부 실행 기준이라는 주의 포함)
- `scenes/` 롱폼·쇼츠·썸네일·캐러셀 장면. `curve.js` 는 원문 그래프를 다시 그린 근삿값
- `demo/` low vs high 비교 데모 방법

```bash
node lectures/002-claude-code-effort/scenes/timing.mjs            # 나레이션 (Qwen3-TTS VoiceDesign)
node toolkit/render.mjs lectures/002-claude-code-effort/scenes/longform.html
```
