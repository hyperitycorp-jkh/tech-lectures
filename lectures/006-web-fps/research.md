# 006 조사 메모 — 클로드 코드로 만든 멀티플레이 웹 FPS

영상의 숫자와 주장은 아래에서만 가져왔다. 게임 코드는 비공개 레포라 이 레포에 옮기지 않았고, 원리 설명과 실행 결과만 쓴다.

## 게임 (비공개 레포, 2026-10-09 새벽 기준)
- **무엇**: 브라우저·폰에서 설치 없이 하는 팀 FPS. 국군 vs 가상의 침투조(실제 국가·군을 적으로 그리지 않음).
- **배포**: https://gunfight-hyperity.web.app · iOS TestFlight
- **기술**: Three.js + TypeScript + Vite, npm workspaces 모노레포(공용 엔진 `engine/*` · 장르 키트 `kits/fps` · 게임 `games/gunfight`)
- **만든 시간**: `games/gunfight`·`kits/fps` 첫 커밋 2026-10-08 12:17 KST → 2026-10-09 02:50 KST 무렵 = 약 14시간. 같은 기간 다른 게임 작업도 함께 돌았다.
- **커밋**: 위 두 폴더 기준 156개(`git log -- games/gunfight kits/fps`, 03:00 무렵). 영상에는 "150개 넘게"로 썼다.
- **코드량**: TypeScript 22,185줄(테스트 포함, 같은 두 폴더)
- **테스트**: 스냅샷 `5c130fb`에서 직접 실행 — kits/fps 70개 통과, games/gunfight 185개 통과·5개 건너뜀 → 255개 통과
- **만든 방식**: PM 세션 하나가 요구를 받아 에이전트(엔진·총게임·병과·맵·서버·출시 — 브랜치 engine-dev, gunfight-dev, fps-classes, fps-maps, backend-dev, release-dev)에 나눠 맡기고, 각자 git worktree에서 동시에 작업. 테스트를 통과하면 PM이 main에 합치고 배포.
  - 병과 담당 에이전트 하나: 약 81만 토큰, 도구 호출 216회, 약 1.5시간 (PM 세션이 알려 준 수치)
- **사용자의 핵심 요구**(대화에서 정한 것, PM 세션 기록 요약): 서버비가 나오면 안 된다(상시 서버 없이, 멀티플레이는 필요) · Three.js · 스페셜포스처럼 방 목록 로비·빠른 시작 · 시작 속도(첫 화면 250KB 예산)
  - 사용자 본인 요약: "어차피 아무도 안 할 테니, 서버비용 많이 나오면 안 되니깐, WebRTC P2P로 중계 · Three.js + TypeScript, 첫 화면 용량 250KB 이하"

## 네트워크 (코드에서 확인)
- 방장 판정형 스타 구조(WebRTC P2P). Firestore는 방 목록·시그널링만.
- 틱 `TICK = 1/30`(초당 30번), 보간 기본 `INTERP = 0.1`초(연결 상태에 따라 0.05~0.2초)
- 되감기 판정 한도 `MAX_REWIND = 0.25`초. 0.1초 안 맞교환 인정, 방장 이전, 연결 품질 기준 방장 선정(PM 세션 설명)
- STUN은 무료 공개 서버(Google·Cloudflare), 막힌 망에서만 Cloudflare TURN. 자격 증명은 Cloud Function이 발급.

## 비용
- Cloudflare Realtime(SFU·TURN) 가격: "$0.05 per GB of egress", "The first 1,000 GB each month is free. SFU and TURN share this allowance" — https://developers.cloudflare.com/realtime/pricing/ (2026-10-09 확인)
- 게임 서버가 없어서 사람이 늘어도 서버비가 거의 늘지 않는다(방 목록·신호·서버 함수만 Firebase).
- 수익 실데이터는 아직 없다. 지어낸 숫자를 쓰지 않는다.

## 돈 버는 계획 (PM 세션, 계획 단계)
- 첫 출시는 광고·결제 없이
- 웹 H5 게임 광고(AdSense), 앱 AdMob. 전면 광고는 혼자 하기 결과 화면에서만, 보상형은 원할 때만
- 광고 제거 ₩3,300(코드에 상품 정의 있음), 꾸미기(군복 위장 무늬·총기 스킨)와 시즌 패스. 능력치 판매(pay-to-win) 없음
- Poki·CrazyGames 같은 웹게임 포털 배포 검토(광고 수익 배분)

## 막혔던 문제 (PM 세션 기록)
1. 빠른 시작을 해도 늘 혼자 AI 판 — 연결이 열리기 전에 보낸 '자리 요청'이 사라짐 → 연결 뒤에 보내게 수정. 독립 브라우저 두 개를 자동으로 붙이는 시험 도구로 확인
2. 배포 직후 옛 코드 조각 404 — 이전 빌드 파일을 남기고 html은 캐시하지 않게
3. 폰 HUD 버튼 13개 — 상황에 따라 뜨는 버튼으로 7개, 노치 영역 자동 검사
4. 병과를 넣으니 판이 늘어짐 — AI끼리 붙이는 템포 측정 테스트로 수치 확인, 부활은 섬멸전에만

## 지도·에셋 라이선스
- 실제 장소 맵(판교역·강남역·광화문·부산역): OpenStreetMap 자료, ODbL 1.0 — "© OpenStreetMap contributors" 표기 (`content/maps/osm/pangyo.osm.json`: 중심 37.39473, 127.11125, 반경 230m, 2026-10-08 수집)
- 모델: Quaternius · Kenney · KayKit (CC0), 효과음은 코드로 합성, 글꼴 Noto Sans KR(OFL)
- 영상의 지도 화면: openstreetmap.org 캡처(© OpenStreetMap contributors)

## 영상 화면
- 게임 화면은 전부 실제 플레이 녹화. `demo/capture-game.mjs`가 게임의 개발용 장면 바로 가기(`?shot=`)로 경기를 열고, 내 병사(0번)에 봇 두뇌를 붙여 조종시키며, 페이지 시간을 가상 시간으로 바꿔 한 프레임씩 찍는다(렌더 속도와 상관없이 정확히 30fps).
- 두 브라우저 화면: 게임 레포의 시험 도구(two-client)로 독립 브라우저 두 개가 빠른 시작 → 같은 판(사람 2 · AI 6). 같은 컴퓨터라 핑 1ms.
