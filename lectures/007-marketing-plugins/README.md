# 007 · 클로드 무료 마케팅 플러그인 3종으로 유튜브 채널 진단하기 — 직접 비교

클로드에 무료 마케팅 플러그인 3종을 붙여서 우리 유튜브 채널(바이브코더) 실제 데이터로 같은 과제를 시켰다.
플러그인 없는 클로드까지 네 조건을 비교했고, AI가 "추측"이라고 적은 것들은 YouTube Analytics로 확인했다.

- 영상: [롱폼](https://youtu.be/gSq07LCARTo) · 쇼츠 [①](https://youtu.be/V2uhuYueFyI) [②](https://youtu.be/_STbxzi_85A) [③](https://youtu.be/RNM_mSWj0NU) (롱폼·쇼츠① 10/17, ② 10/18, ③ 10/19 19:00 공개)

## 도구
| | 앤트로픽 공식 Marketing | Social Media Skills | marketingskills |
|---|---|---|---|
| 스킬 | 8개 | 106개 | 50개 |
| 라이선스 | Apache-2.0 | MIT | MIT |
| 설치 | `claude plugin marketplace add anthropics/knowledge-work-plugins` → `claude plugin install marketing@knowledge-work-plugins` | `/plugin marketplace add social-media-skills/skills` → `/plugin install social-media-skills@social-media-skills` | `npx skills add coreyhaines31/marketingskills --skill copywriting` |

## 결과 (2026-10-17, 같은 모델·같은 과제)
| 조건 | 걸린 시간 | 토큰 | 눈에 띈 것 |
|---|---|---|---|
| 플러그인 없이 | 15.6분 | 16.3만 | 가장 빠름. 핵심 결론 4개는 똑같이 냄 |
| 공식 Marketing | 24.1분 | 25.3만 | 보고서 형식(핵심 지표 표·상태 3단계), 7일 뒤 목표를 범위로 |
| Social Media Skills | 19.2분 | 23.5만 | 썸네일을 폰 크기(168×94)로 검사, 훅 후보 채점표 |
| marketingskills | 19.8분 | 24.5만 | 심리학 근거(앵커링·지식의 저주), "21일 중 12일 업로드 0" |

- 넷 다 같은 결론: 쇼츠 1,200회 벽 · 39회 쇼츠 노출 문제 · 롱폼 2편 제목·썸네일 교체 · 쇼츠→롱폼 연결.
- AI의 추측 → 실제 데이터(YouTube Analytics, 9/25~10/16):
  - 1,200회 쇼츠 8편은 조회의 98~100%가 첫 이틀
  - 39회 쇼츠(004②)는 쇼츠 피드 유입 0회 — 18편 중 유일
  - 1,200회 쇼츠 8편 9,705회 중 참여 조회 2,570회(26%)
  - 004 롱폼 213회 중 194회(91%)가 검색, 1위 검색어 '오픈라우터'
- 주의: 스킬 이름·설명은 대화를 시작할 때 항상 불러온다(공식 문서). Social Media Skills 106개를 통째로 깔면 설명만 98,603자.

## 따라 하기
```bash
node toolkit/publish.mjs auth youtube                                   # 분석 권한 포함 로그인(채널 선택 화면에서 내 채널)
node lectures/007-marketing-plugins/demo/channel-data.mjs out.json      # 영상별 제목·길이·조회·좋아요·댓글
node lectures/007-marketing-plugins/demo/channel-analytics.mjs out.json # 첫 이틀 비율·평균 시청·구독
```
같은 과제 문서(`demo/task.md`)와 데이터를 주고 플러그인별로 돌린다. 네 결과 원문은 `demo/results/`.

## 다음
처방(롱폼 001·006 제목·썸네일 교체, 막힌 쇼츠 2편 첫 1초 고쳐 다시 올리기, 쇼츠→롱폼 연결)을 실제로 적용하고, 일주일 뒤 숫자로 비교한다(008).
