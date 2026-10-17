# 007 조사 메모 — 클로드 무료 마케팅 플러그인 3종

영상의 사실과 숫자는 아래에서만 가져왔다. 유료 도구는 다루지 않는다(사용자 결정).

## 도구 (2026-10-17 확인)
| | 앤트로픽 공식 Marketing | Social Media Skills | marketingskills |
|---|---|---|---|
| 만든 곳 | Anthropic (knowledge-work-plugins) | Frank Heijdenrijk | Corey Haines |
| 라이선스 | Apache-2.0 | MIT | MIT |
| 스킬 수 | 8 (brand-review, campaign-plan, competitive-brief, content-creation, draft-content, email-sequence, performance-report, seo-audit) | 106 | 50 |
| GitHub 별 | (레포 전체) | 161 | 55.1k (포크 8.2k) |
| 설치 | `claude plugin marketplace add anthropics/knowledge-work-plugins` → `claude plugin install marketing@knowledge-work-plugins` | `/plugin marketplace add social-media-skills/skills` → `/plugin install social-media-skills@social-media-skills` (또는 `npx skills add social-media-skills/skills`) | `npx skills add coreyhaines31/marketingskills -a claude-code` (`--skill copywriting`처럼 골라서도) |
| 출처 | https://github.com/anthropics/knowledge-work-plugins/tree/main/marketing | https://github.com/social-media-skills/skills | https://github.com/coreyhaines31/marketingskills |

- 공식 Marketing README: "primarily designed for Cowork … though it also works in Claude Code". 유튜브·쓰레드 전용 기능이나 게시 기능은 없다(글 초안·기획·보고서).
- Social Media Skills에는 youtube-shorts, youtube-long-form, youtube-publishing-and-metadata, thumbnail-design, hook-writer, threads-post, analytics-and-reporting 등이 있다.
- marketingskills에는 copywriting, marketing-psychology, social, video, aso, seo-audit 등이 있다.

## 스킬은 어떻게 불러와지나 (Anthropic 공식 문서)
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- Level 1 메타데이터(name, description)는 시작할 때 항상 시스템 프롬프트에 들어간다. 스킬당 약 100토큰(문서의 표).
- 본문(SKILL.md)은 그 스킬이 쓰일 때만 읽는다(5k 토큰 이하 권장). description 최대 1024자.
- 보안: 믿을 수 있는 출처의 스킬만 쓰고, 남이 만든 스킬은 파일을 다 읽어 보고 쓰라고 권한다.

## 우리가 잰 것
- 스킬 목록(이름+설명) 글자 수 — 각 저장소를 받아 frontmatter를 합산(2026-10-17):
  - 공식 Marketing 8개: 2,720자
  - Social Media Skills 106개: 98,603자 (스킬당 평균 약 930자 — 설명이 길다)
  - marketingskills 50개: 39,541자
  - 토큰 환산은 추정(영어 약 4자 = 1토큰): 각각 약 680 / 24,650 / 9,885 토큰
- 보안 점검: 세 저장소의 SKILL.md에서 위험한 명령(rm -rf, 원격 스크립트 실행)을 찾았다. 읽기용 `curl` 예시 3곳(marketingskills social·image·directory-submissions)뿐이었다.

## 우리 채널 실제 데이터 (YouTube Analytics, 2026-09-25 ~ 10-16)
- 영상 23편(롱폼 5, 쇼츠 18), 구독자 9명.
- 쇼츠 조회수의 87~100%가 공개 첫 2일에 들어온다.
- 잘 된 쇼츠 8편은 1,111~1,262회. 006 쇼츠①은 1,230회 중 1,167회가 쇼츠 피드.
- 막힌 004 쇼츠②(39회)는 쇼츠 피드 0회, 검색 37회. 평균 시청 비율은 64%로 오히려 높았다.
- 004 롱폼 213회 중 194회(91%)가 유튜브 검색. 검색어 1위 '오픈라우터'(18), 'openrouter'(5).
- 006 롱폼 검색 유입 29회, 002 롱폼 검색 44회 + 추천 24회.
