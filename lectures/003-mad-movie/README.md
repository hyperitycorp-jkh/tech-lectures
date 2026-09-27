# 003 · 오푸스 5.5로 매드무비 만들기 — 누끼·박자·자막까지

"오푸스한테 매드무비 부탁하면 다 해 준다"는 경험담을 직접 재현했다.
무료 스톡 영상에 누끼·박자·자막·효과를 입혀 15초 매드무비를 만들었다. 같은 규칙을 엔진으로 만들어 설정 파일 하나로 앱 광고 4편도 뽑았다.

## 결과
- 댄스 매드무비(공개 예시): `scenes/mad.html?c=dance`, 설정은 `scenes/dance.mad.js`
- 앱 광고 4편(러닝·소개팅·알람·사진 일기): 회사 앱이라 설정과 에셋은 `private/`에 두고 공개하지 않는다
- 롱폼: https://youtu.be/Rw1ZngcDDco (2026-09-27 19:00 공개)
- 쇼츠 7편: 결과 몽타주 · 맥 누끼 꼼수 · 댄스 · 러닝 앱 · 소개팅 앱 · 알람 앱 · 사진 일기 앱 — 9/27~10/3 매일 19:00 공개 (주소는 publish.json)
- 매드무비 규칙 한 장: https://storage.googleapis.com/hyperity-lecture-assets/mad-movie/mad-rules.png

## 방법 요약
1. **소스**
   - Mixkit 무료 스톡 영상을 쓴다(Stock Video Free License — 유튜브·상업 OK, 표기 불필요).
   - 음악은 `render.mjs`가 합성하는 비트다.
2. **프레임:** `node toolkit/clip.mjs media/x.mp4 scenes/clips/x --w 1920 --ext jpg --duration 8`
3. **누끼**
   - macOS Vision을 쓰므로 설치가 필요 없다.
   - `swiftc -O toolkit/cutout.swift -o /tmp/cutout && /tmp/cutout scenes/clips/x scenes/clips/x-cut`
   - 역광 실루엣이면 `--mode subject`, 엉뚱한 사람까지 잡히면 `--roi x,y,w,h`를 붙인다.
4. **편집**
   - 엔진은 `scenes/mad.html`(= `toolkit/templates/mad.html`)이고, 설정은 `<이름>.mad.js`에 마디(4박)마다 효과를 하나씩 적는다.
   - 렌더: `node toolkit/render.mjs lectures/003-mad-movie/scenes/mad.html --query c=dance --name dance-mad`
   - 규칙: `.claude/skills/tech-lecture-video/SKILL.md`의 "매드무비 규칙" 절. 한 장짜리 요약은 `scenes/out/mad-rules.png`(캐러셀 4장).

## 잘한 점 / 약한 점
- **잘한 점**
  - 누끼가 빠르고 깔끔하다: 360장에 25초, 머리카락까지 잡는다.
  - 박자 편집이 결정적이라 설정만 바꾸면 스타일이 바로 바뀐다.
  - 앱 광고용 효과(앱 화면·지도 경로·흐림→선명·목소리 파형·폴라로이드)를 새로 만들어도 기존 규칙 안에서 돌아간다.
- **약한 점**
  - 역광 실루엣은 사람 분할이 실패한다. 피사체 모드로 해결했다.
  - 벽화 속 인물을 사람으로 잡는다. 영역 지정으로 해결했다.
  - 합성 비트는 실제 곡보다 밋밋하다. 실제 곡을 쓰려면 박자 검출이 필요하다.
  - 무료 스톡 중 일부는 720p까지만 있다.

## 파일
- `research.md`: 계기, 라이선스, 누끼 방식, 실측
- `test/mad.html`: 첫 테스트(엔진 이전)
- `scenes/`: 강의 장면(longform·shorts·thumbnail·carousel), 매드무비 엔진과 댄스 설정
