# 데모 — 같은 요청, effort 만 다르게 (예정)

같은 문장을 Claude Code(Opus 5.5)에 effort low / high 로 각각 시켜 결과를 나란히 비교한다.

```bash
P='유튜브 썸네일을 1280×720 HTML 한 파일로 만들어줘. 주제: 클로드 코드 effort 설정 가이드'
mkdir -p low high
(cd low  && claude -p "$P" --model opus --effort low  --permission-mode acceptEdits --output-format json > run.json)
(cd high && claude -p "$P" --model opus --effort high --permission-mode acceptEdits --output-format json > run.json)
```

`run.json` 에 걸린 시간(duration_ms)·토큰(usage)·비용이 남는다.
영상(002) 제작 때는 터미널 로그인이 만료돼 돌리지 못했고, 원문 수치로 대신했다.
