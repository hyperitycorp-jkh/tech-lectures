# 조사 — 오푸스 5.5로 매드무비(박자 편집 영상) 만들기

## 계기
- SNS 글(2026-09-27 전후, 원글 링크 미확인): Opus 5.5 에게 아이돌 매드무비를 만들어 달라고 했더니
  소스 구하기·누끼·자막 효과까지 다 해 줬다는 경험담.
- 우리 판단: 특별한 프롬프트보다 도구 조합의 결과다. 오푸스가 코드를 짜서 yt-dlp·ffmpeg·분할 모델·렌더를 엮는다. → 직접 재현해 봄(`test/`, `scenes/`)

## 소스와 라이선스
- **Mixkit Stock Video Free License** (mixkit.co/license, 2026-09-27 확인)
  - 사용 가능: YouTube videos, Social media, Online marketing ads, Commercial projects 등
  - 권리: "download, copy, modify, distribute, publicly perform and broadcast". 표기는 필수가 아니며 권장.
  - 일부 신작은 무료 파일이 720p까지만 있다(예: 46653, 46654, 26923, 37008). 1080p가 없으면 `-720.mp4`.
  - 에셋 URL 규칙: `https://assets.mixkit.co/videos/<id>/<id>-1080.mp4`
- 음악: render.mjs `teaser` 합성(직접 만든 비트)이라 저작권 문제가 없다.
  - 실제 곡을 쓰면 라이선스를 따로 확인하고, BPM을 맞추거나 박자를 검출해야 한다.
- **아이돌·방송 영상은 쓰지 않는다.**
  - 이유: 소속사 권리이고, 유튜브 약관상 다운로드가 금지이며, 채널에 올리면 저작권 신고 위험이 있다.
  - 강의에서는 "방법은 같다, 소스만 권리 있는 것으로"라고 안내한다.

## 누끼 — macOS Vision (다운로드 없음)
- `VNGeneratePersonSegmentationRequest` (qualityLevel `.accurate`): 사람 분할. 머리카락까지 잘 잡는다.
- `VNGenerateForegroundInstanceMaskRequest` (macOS 14+): 사진 앱의 '피사체 들어올리기'와 같은 방식이다.
- 구현: `toolkit/cutout.swift`
  - 입력은 JPG/PNG 프레임 폴더, 출력은 투명 PNG다.
  - 옵션은 `--feather`와 `--roi`가 있다. `--roi`는 벽화 속 사람처럼 잘못 잡히는 것을 영역으로 막는다.
- 실측 (M4 Pro, 1920×1080)
  - 360프레임에 약 25초, 240프레임에 약 15초 걸렸다.
  - 체크 셔츠 댄서는 머리카락까지 깔끔하게 나왔다.
  - 농구 코트 장면은 벽화 속 인물도 사람으로 잡아서 `--roi 0.27,0,0.73,1`로 해결했다.

## 편집 규칙 (엔진 `toolkit/templates/mad.html` + 설정 `*.mad.js`)
- 128 BPM 기준으로 1박은 0.469초, 1마디(4박)는 1.875초, 8마디는 15초다.
- 구조: 인트로 → 라이저 → 드롭 5마디 → 엔딩. 자세한 규칙은 SKILL.md "매드무비 규칙"에 있다.
- 효과 사전: letters hook riser pop echo cuts behind letterbox phone blur route pulse cards outro

## 재현 기록
- `test/mad.html`: 첫 테스트(댄스, 15초). 엔진으로 옮긴 것이 `scenes/dance.mad.js`다.
- 회사 앱 4종(러너·블러리·모닝콜·메모리)은 `private/*.mad.js`에 있다. 앱 화면·로고는 실제 자산이다.
