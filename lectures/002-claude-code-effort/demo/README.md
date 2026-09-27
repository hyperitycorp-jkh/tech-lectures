# 데모 — 같은 요청, effort 만 다르게

같은 요청을 Claude Code(Opus 5.5) 에이전트에 effort low / high 로 각각 한 번씩 시켰다.
에이전트 정의는 `.claude/agents/effort-low.md` · `effort-high.md` (frontmatter `effort: low|high`, `model: opus`).

요청 (둘 다 같음, 저장 경로만 다름):
> 유튜브 썸네일을 만들어줘. 주제: "클로드 코드 effort 설정 가이드 — 언제 low, 언제 max?" 1280×720 크기의 HTML 파일 하나로 …
> 외부 이미지는 쓰지 말고, 폰트는 Pretendard CDN. 이 폴더 밖의 파일은 읽거나 참고하지 마.

| | 시간 | 도구 호출 | 토큰(에이전트 합계) | 검증 | 결과 |
|---|---|---|---|---|---|
| low  | 21초 | 2번 | 50,407 | 렌더 확인 안 함 | `thumb-low/` (HTML 1.4KB) |
| high | 63초 | 5번 | 55,862 | 헤드리스 Chrome으로 렌더해 확인 | `thumb-high/` (HTML 5.8KB) |

각 1회 실행이라 편차가 있을 수 있다. 캡처: `node toolkit/capture.mjs shot file://…/thumbnail.html thumb.png --w 1280 --h 720`

터미널에서 직접 해 보려면:

```bash
claude -p "<위 요청>" --model opus --effort low  --permission-mode acceptEdits
claude -p "<위 요청>" --model opus --effort high --permission-mode acceptEdits
```
