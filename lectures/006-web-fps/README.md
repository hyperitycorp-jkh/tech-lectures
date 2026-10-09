# 006 · 클로드 코드로 하루 만에 멀티플레이 FPS 게임 만들기 — 게임 서버비 0원

클로드 코드로 브라우저·폰에서 바로 하는 멀티플레이 FPS를 만들었다. 첫 커밋부터 약 14시간, 커밋 150개 넘게, 자동 테스트 255개가 통과했다.
게임 서버 없이 WebRTC P2P로 브라우저끼리 직접 연결해서, 사람이 늘어도 서버비가 거의 늘지 않는다.

- 영상: [롱폼](https://youtu.be/7mHp6IDRYRM) · 쇼츠 [①](https://youtu.be/HolOdzpcrKY) [②](https://youtu.be/1UR1tkxJKOw) [③](https://youtu.be/bmqC5VrXT9Y) (롱폼·쇼츠① 10/9 19:00, ② 10/10, ③ 10/11 공개 예약 · 쓰레드 10/9 19:05)
- 게임: https://gunfight-hyperity.web.app
- 시작 프롬프트 전문: [`prompt.md`](prompt.md)
- 게임 코드는 비공개 레포다. 이 폴더에는 원리 설명, 실행 결과, 영상 장면만 둔다.

## 결과 (2026-10-09 새벽 기준)
- **구조**: 방장 브라우저가 판정하고(초당 30번, 화면은 0.1초 늦게 그림), Firebase는 방 목록·연결 신호만 맡는다. 막힌 망에서만 Cloudflare TURN 중계를 쓴다(월 1,000GB 무료).
- **공정성**: 쏜 순간으로 되감아 판정(최대 0.25초), 0.1초 안 맞교환 인정, 방장이 나가면 이어받기, 연결 좋은 사람이 방장.
- **맵**: OpenStreetMap 건물 자료로 만든 판교역·강남역·광화문·부산역. 낮·해질녘·밤.
- **만든 방식**: PM 세션 하나 + 에이전트 6개(엔진·총게임·병과·맵·서버·출시)가 각자 git worktree에서 동시에 작업하고, 테스트를 통과하면 PM이 합쳐 배포.
- **막혔던 4가지**: 빠른 시작해도 늘 혼자(연결 전 요청 유실) · 배포 직후 404 · 폰 버튼 13개 → 7개 · 병과를 넣으니 늘어지는 판.
- 수익은 아직 계획 단계다(첫 출시는 광고·결제 없음 → AdSense·AdMob, 광고 제거 ₩3,300, 꾸미기·시즌 패스, pay-to-win 없음).

## 영상 만드는 법
게임 화면은 전부 실제 플레이 녹화다. [`demo/capture-game.mjs`](demo/capture-game.mjs)가:
1. 게임의 개발용 장면 바로 가기(`?shot=`)로 앱을 띄우고 원하는 맵·모드로 경기를 연다.
2. 내 병사에게 봇 두뇌를 붙여 대신 싸우게 하고, 카메라는 1인칭으로 그 시선을 부드럽게 따라간다.
3. 페이지의 `requestAnimationFrame`·`performance.now`를 가상 시간으로 바꿔 한 프레임씩 진행하며 찍는다. 렌더가 느려도 결과는 정확히 30fps다.

```bash
# 게임 개발 서버를 띄운 뒤 (게임 레포에서)
GAME_SRC=<게임 레포 경로> node lectures/006-web-fps/demo/capture-game.mjs --map pangyo --pilot --seconds 20 --out lectures/006-web-fps/scenes/clips/fp-pangyo
node lectures/006-web-fps/scenes/timing.mjs            # 나레이션 (Qwen3-TTS, D2 목소리 고정)
node toolkit/render.mjs lectures/006-web-fps/scenes/longform.html
```

## 파일
- `research.md`: 수치·출처(커밋·테스트 실측, 네트워크 상수, Cloudflare 가격, 라이선스)
- `prompt.md`: 시작 프롬프트 전문
- `demo/capture-game.mjs`: 게임 플레이 녹화(가상 시간 + 봇 조종)
- `scenes/`: 롱폼·쇼츠 3편·썸네일 2종·캐러셀 5장
- `captures/`: 지도 캡처(© OpenStreetMap contributors), 두 브라우저 화면, 캐러셀
