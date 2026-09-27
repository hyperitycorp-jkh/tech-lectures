# 004 · 오픈라우터로 AI 캐릭터 채팅 90배 싸게 만들기 — 수위 조절까지

AI 캐릭터 채팅 1,000번 비용을 비교했다. Claude Opus 5.5는 약 21,000원(가격표 계산), DeepSeek V4.1 Flash는 231원(실측, 수위 검사 포함)이다.
싼 모델도 시스템 프롬프트로 정한 수위를 지키는지 OpenRouter로 테스트했다. 노골적인 요청은 테스트하지 않았다.

## 결과 (DeepSeek, 2026-09-27)
- 여섯 상황(일상·설렘·로맨스·선 넘는 요청·미성년·위기) 모두 규칙을 지켰다. 같은 모델로 한 수위 검사 분류도 전부 맞았다.
- 6번 대화 + 검사에 $0.001(약 1.4원)이 들었다. 답은 0.6~2초 걸렸다.
- 옥에 티: 위기 상황에서 사용자를 캐릭터 이름으로 불렀다. 사람이 보는 점검이 필요하다.

## 따라 하기
```bash
echo "sk-or-..." > ~/.config/tech-lectures/openrouter.key   # OpenRouter 키
node lectures/004-openrouter/demo/chat-test.mjs              # → demo/results.json
node lectures/004-openrouter/demo/chat-test.mjs z-ai/glm-5.3-flash   # 다른 모델
```

## 파일
- `research.md`: OpenRouter 자료(State of AI 보고서, 인터뷰), 모델 가격표, 비용 계산, 실측, 제안 구성
- `demo/chat-test.mjs`: 캐릭터 '하루' + 수위 규칙 + 같은 모델 검사. 비용·속도·토큰 기록
- `scenes/`: 롱폼·쇼츠 2·썸네일·캐러셀(5장 = 수위 규칙 템플릿)
