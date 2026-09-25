---
name: tech-lecture-video
description: 새 기술을 직접 테스트하고 응용한 결과를 유튜브 강의(롱폼)와 쇼츠·인스타 캐러셀·릴스·쓰레드로 만든다. 영상은 영상 생성 AI 없이 HTML 장면을 헤드리스 Chrome으로 캡처하고 ffmpeg로 묶는 코드 렌더 방식이다. "강의 영상 만들어줘", "이거 테스트해서 유튜브로", "쇼츠/릴스/캐러셀/썸네일 만들어줘", "코드로 영상", "새 기술 써보고 정리" 같은 요청이나 lectures/ 폴더 작업에 사용한다.
---

# 새 기술 테스트 → 응용 → 강의 영상

이 레포(`tech-lectures`)에서 강의 하나는 `lectures/NNN-주제/` 폴더 하나다.
도구는 `toolkit/`(= 이 스킬 폴더의 `toolkit/`), 모든 명령은 **레포 루트에서** 실행한다.

## 워크플로 (순서대로)

1. **조사** — 새 기술의 공식 발표·문서·실제 사례를 찾아 `research.md`에 출처 링크와 함께 요약한다. 추측은 추측이라고 적는다.
2. **결과물 상의** (사용자와 먼저 정한다) — "무엇을 테스트하고 어떤 결과물(데모)을 만들지" 후보 3개와 추천 1개를 제시하고 답을 받은 뒤 진행한다. 사용자의 실제 프로젝트를 쓰면 가장 설득력 있다.
3. **테스트·데모 제작** — `demo/`에 실제로 돌아가는 코드를 만든다. 시청자가 따라 할 수 있게 README에 실행 방법을 적는다.
4. **구성안 + 질문** — 롱폼 챕터 구성(5~10분)을 짜고, 모르는 것만 5개 이하로 기본값과 함께 묻는다(길이·비율·목소리·스타일·공개 범위). "기본값으로"면 그대로 진행.
5. **자료화면·결과화면 수집** → `captures/`
   - 웹페이지·공식 문서·GitHub: `node toolkit/capture.mjs shot <url> lectures/NNN/captures/x.png` — 화면에 **출처 표기**, 남의 글은 짧게
   - 데모 웹앱 실행 화면: `node toolkit/capture.mjs record <url> lectures/NNN/captures/demo.webm --seconds 10`
   - 영상 결과물을 장면 안에서 재생: `node toolkit/clip.mjs <video> lectures/NNN/clips/<name> --w 1280`
   - 모바일 앱: iOS 시뮬레이터 스크린샷
   - 터미널·코드: 실제 출력을 복사해 템플릿의 `code` 챕터로 (가짜 출력 금지)
6. **장면 작성** — `toolkit/templates/*.html`을 `lectures/NNN/scenes/`로 복사하고 `CONTENT`만 고친다.
   - `longform.html` 16:9 강의. 챕터 종류 cover·points·code·image·clip·**compare(왼쪽 강의 화면 + 오른쪽 실제 결과)** (001 롱폼은 montage·side·trio·endcard 추가판)
   - `shorts.html` 9:16 60초 이하 (유튜브 쇼츠 = 인스타 릴스 같은 파일)
   - `thumbnail.html` 1280×720 · `carousel.html` 1080×1350 장별
   - 나레이션은 `CONTENT.narration` — macOS `say`(Yuna)로 초안 + SRT 자동. 본인 녹음이 있으면 `META.VOICE_FILE`
   - **목소리는 Qwen3-TTS(로컬·무료) 권장** (엔진 기본값은 say라 META에 지정해야 함) — `META.VOICE_ENGINE: 'qwen'`, `VOICE: 'Sohee'`, `VOICE_INSTRUCT: '밝고 귀엽고 에너지 넘치는 톤, 살짝 웃으면서 말하듯이'`, `VOICE_SPEED: 1.15`. 처음 한 번 `sh toolkit/tts/setup.sh` (실행환경 0.4GB + 모델 2.9GB, 레포 밖). macOS `say`는 지루하다는 피드백으로 초안용만
   - 음성은 `<scene>/tts-cache/`에 문장별로 캐시된다(Qwen은 매번 조금씩 다르게 읽음). 긴 강의는 대본에서 줄 길이를 먼저 재고(`toolkit/tts.mjs`의 `voice()`) 챕터 시각을 계산한다 — 예: `lectures/001-*/scenes/timing.mjs`
   - 대본은 말하듯 "~해요" 말투, 영문 용어는 `say` 필드에 한글 발음으로 (자막은 원래 표기)
   - **말하는 캐릭터 아바타**: 오른쪽 아래 SVG 캐릭터, 입 = `envelope()` 음량(프레임당 0~9), 눈 깜빡임은 프레임 번호로 — 예: `lectures/001-*/scenes/longform.html`. 본문·자막 오른쪽 끝을 1680px 안으로
   - **구성(리텐션)**: 0~15초 결과 몽타주 + 훅 한 줄 → 약속 + 궁금증 걸기("마지막에 ○○") → 본론(화면은 5~10초마다 바뀌게) → 가치를 준 뒤 구독 한 줄 → 걸어 둔 궁금증 회수 → 따라 하기 → 다음 영상 예고 + 엔드스크린 20초. 썸네일 제목 = 첫 장면 훅과 같은 약속
7. **렌더 → 프레임 검수 → 수정 반복** (가장 중요)
   - `node toolkit/render.mjs lectures/NNN/scenes/longform.html` → `scenes/out/longform.mp4` + `.srt`
   - `--still` (썸네일), `--still --query slide=N` (캐러셀 장별)
   - 렌더 후 **장면 중간 프레임 + 장면 경계 프레임**을 ffmpeg `xstack` 콘택트 시트로 모아 직접 이미지로 보고 확인한다. 에러 없이 돌아도 겹침·잘림은 눈으로만 보인다.
   - `ffprobe`로 해상도·fps·길이·오디오 스트림 확인
8. **배포 문구** — `publish.md` 하나에 순서대로: 유튜브(제목 후보 3·설명·챕터 타임스탬프·태그·GitHub/노션 링크) → 쇼츠/릴스 캡션·해시태그 → 캐러셀 장별 문구 → 쓰레드 연재(5~8개 포스트). **롱폼 대본이 원본**이고 나머지는 거기서 잘라 쓴다.
9. **공유**
   - 영상: `gcloud storage cp <mp4> gs://hyperity-lecture-assets/<강의>/` → `https://storage.googleapis.com/hyperity-lecture-assets/...` (공개 버킷, 비공개 파일 금지)
   - 노션: Notion MCP로 `📚 강의` 페이지(id `3e6db7ff-b044-814c-a335-e314045d2e24`) 아래에 강좌 페이지 생성, 챕터와 같은 구조, 영상은 `<video src="버킷 URL">`
   - GitHub: 레포 README 강의 목록 표에 한 줄 추가. **푸시·레포 생성은 매번 사용자에게 확인받은 뒤에만.** 유튜브·인스타·쓰레드 업로드는 사용자가 직접 한다.

## 규칙

- **원문만**: 화면의 문구·수치는 출처(공식 문서, 레포, 보도자료)에 있는 것만. 연출용 숫자는 화면에 "예시" 표기.
- **공개 금지**: 회사 앱 에셋·내부 문서·그걸 쓴 장면은 `lectures/NNN/private/`(gitignore). 영상·프레임·클립도 git에 안 넣는다(.gitignore).
- **결정성**: `renderFrame(f)`는 같은 f에 항상 같은 그림. `Math.random`/`Date` 금지(시드 난수 사용).
- **안전 영역**: 쇼츠·릴스는 위아래 15%에 글자 두지 않기. 썸네일 제목은 3~6단어.

## 함정 체크리스트 (실제로 겪은 것)

| 증상 | 원인 → 해결 |
|---|---|
| 장면 전환 때 제목 두 개가 겹침 | 앞뒤 구간이 겹침 → 구간을 이어 붙이고 경계 프레임 검수 |
| `roundRect` 음수 반지름 에러 | 부동소수점 → `Math.max(0, r)` |
| 모듈·이미지 로드 실패 | `file://` 차단 → render.mjs의 로컬 서버 사용, 경로는 `/`로 시작 |
| 3D·셰이더 빈 화면 | 헤드리스 GPU → swiftshader 플래그(render.mjs에 있음), `preserveDrawingBuffer: true` |
| 폰 캡처가 틀 안에서 잘려 보임 | 컨테이너 높이 부족 → 화면 밖까지 넉넉히 |
| 헤드라인이 단어 중간에서 줄바꿈 | 줄을 직접 나눈다(배열로) |
| 로고 글자 중복(아이콘에 이미 이름) | 엔드카드는 아이콘 + 태그라인 |
| 나레이션 겹침 | render.mjs 경고 보고 다음 줄 t를 늦춘다 |
| 브라우저 폰트 뭉개짐(픽셀아트) | 비트맵 폰트 직접 그림 |
| 긴 ffmpeg `aevalsrc` 실패 | 오디오는 Node에서 PCM으로 합성(render.mjs) |
| Playwright Chromium 캐시가 사라짐 | render.mjs가 시스템 Chrome으로 자동 대체 |
| 출처에 없는 정보를 붙임(도시별 프로그램 종류 등) | 원문 대조 후 삭제 |

## 폴더 구조

```
lectures/NNN-주제/
  README.md      무엇을 테스트했나 · 결과 · 잘한 점/약한 점 · 링크
  research.md    출처 링크
  demo/          따라 할 수 있는 코드
  captures/      자료화면·결과화면 (공개 가능한 것만)
  scenes/        longform·shorts·thumbnail·carousel.html (+ out/, frames/ 는 gitignore)
  publish.md     유튜브 → 쇼츠/릴스 → 캐러셀 → 쓰레드 문구
  private/       공개 금지 자료 (gitignore)
```
