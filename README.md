# yangyeongju.com

Yeongju Yang 양영주의 포트폴리오 사이트 (GitHub Pages, 정적 HTML).

## 글자·작품 정보 고치기 (가장 자주 할 일)

1. `_src/content.py` 를 엽니다. 사이트의 **모든 글자와 작품 정보**가 이 파일 하나에 있습니다.
   (홈 소개 문장, 스테이트먼트, 미디어아트 설명, 페인팅 제목·연도, CV 항목, 연락처, Wish Tower 문구)
2. 따옴표 안의 글자만 고치고 저장합니다.
3. 저장소 폴더에서 실행합니다:
   ```
   python _src/build.py
   ```
   모든 HTML 페이지가 다시 만들어집니다. (추가 설치 필요 없음)
4. 브라우저로 `index.html` 을 열어 확인한 뒤 push 합니다.

> HTML 파일을 직접 고치면 다음 build 때 덮어써집니다. 글자는 항상 `content.py` 에서 고치세요.

- **CV 항목 숨기기/보이기**: `content.py` 의 CV 각 줄 맨 앞 `True`(보이기) / `False`(숨기기).
  숨긴 항목은 HTML 에 아예 들어가지 않아 검색에도 잡히지 않습니다.
- **페인팅 추가**: 이미지 변환 → `PAINTING` 목록에 한 덩어리 복사·수정 → build
  ```
  pip install pillow            (처음 한 번)
  python _src/images.py painting "원본경로.jpg" 새-그림이름
  ```
  한 작품에 여러 장(전경, 부분)을 넣으려면 `images` 에 줄을 추가합니다. 첫 장이 목록에 보입니다.
- **미디어아트 추가**: `python _src/images.py media "원본.jpg" 새-작품/01` (02, 03… 반복) → `MEDIA` 목록에 복사·수정 → build
- **Wish Tower 색 규칙(키워드→색)**: `_src/archive.js`
- **색·글꼴·간격**: `assets/css/site.css` 맨 위 `:root`
- **잉크 효과**: `assets/js/ink.js` (`decay` 값을 키우면 잉크가 더 오래 남음)

## 폴더 구조

```
_src/content.py            ★ 모든 글자·작품 정보 (여기만 고치면 됨)
_src/build.py              content.py → HTML 페이지 생성
_src/images.py             원본 사진 → 웹용 WebP 변환
_src/archive.js            Wish Tower(Firebase) 스크립트
                           ※ "_" 로 시작하는 폴더는 GitHub Pages 에 공개되지 않습니다
index.html                 홈 (생성됨)
works/index.html           PORTFOLIO — Media art / Painting 탭 (생성됨)
works/<작품>.html           미디어아트 작품 상세 (생성됨)
cv.html, contact.html, archive.html, 404.html, sitemap.xml   (생성됨)
qrinfo.html                QR 코드용 링크 페이지 (직접 관리)
assets/css/site.css        공통 스타일
assets/js/ink.js           마우스 잉크 효과 (WebGL)
assets/js/site.js          커서, 탭, 미리보기, 페인팅 크게 보기
assets/img/media/<작품>/    01.webp = 대표, 02.webp~ = 갤러리, -s = 작은 미리보기
assets/img/painting/       <이름>.webp + <이름>-s.webp
assets/img/site/           히어로 영상, 아이콘, 공유 이미지
portfolio.html, portfolio_manu.html, artwork_list/*.html
                           예전 주소 → 새 주소 자동 이동 (지우지 마세요)
```

## 두 개의 표면 (디자인 원리)

- **paper** — 페인팅, 텍스트 페이지. 잉크가 종이에 스며들 듯 곱하기(multiply)로 섞입니다.
- **screen** — 미디어아트 페이지. 안료가 빛처럼 겹쳐집니다(screen).
- 각 페이지 `<html data-surface="paper|screen">` 으로 정합니다. Portfolio에서는 탭을 바꾸면 표면이 바뀝니다.
- 마우스를 움직이면 잉크가 남고, 클릭하면 도장이 찍힙니다. 움직임 줄이기 설정 사용자에게는 꺼집니다.

## 이미지 원칙

- 원본 고해상도 파일(수십 MB)은 저장소에 올리지 말고 컴퓨터/클라우드에 따로 보관하세요. 웹에는 2000px 이하 WebP만.
- 예전 `static/` 폴더(179MB)는 이번 정리로 4~5MB가 되었습니다.

## 배포

```
git add -A
git commit -m "Redesign: new structure, optimized images"
git push origin main
```
`CNAME` 파일(yangyeongju.com)은 지우지 마세요.

---

## 보안 메모

GitHub Pages 저장소는 **공개**라서, 저장소에 들어있는 파일은 전부 `yangyeongju.com/파일이름` 으로 누구나 열 수 있습니다.
그래서 사이트에 필요 없는 파일은 저장소에서 빼는 것이 원칙입니다.

**이번 정리에서 저장소에서 뺀 것 (사이트에 필요 없음)**
- `express.js`, `node_modules/` — 서버 코드. GitHub Pages는 서버를 실행하지 않으므로 의미가 없고, 서비스 계정 키 경로를 드러냅니다.
- `sentences.txt` — 관객이 남긴 소원(건강·가족 이야기 포함)이 공개 주소로 열려 있었습니다.
- `jum.py`, `gitgo.txt`, `.vscode/`, `.firebaserc`, `firebase.json`, `database.rules.json`, 빈 작품 페이지들
- 필요하면 저장소 **밖**(개인 폴더)에 보관하세요.

**Wish Tower 보안 규칙** — Firebase 콘솔 → wish-tower → Realtime Database → 규칙.
`archive.html` 의 `apiKey` 는 원래 공개되는 값이라 괜찮지만, 진짜 보호는 이 규칙이 합니다.
현재 규칙이 `".write": true` 라면 누구나 메시지를 지우거나 덮어쓸 수 있습니다. 아래처럼 "새 글 추가만, 120자 이하"로 바꾸는 것을 권합니다.

```json
{
  "rules": {
    "messages": {
      ".read": true,
      "$id": {
        ".write": "!data.exists()",
        ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 120"
      }
    }
  }
}
```

**코드를 다른 사람(또는 AI)에게 보낼 때 빼야 할 것**
- `.git/` 폴더 — 전체 수정 이력과 지금까지의 모든 이미지가 들어 있어 용량이 크고(이번 zip 351MB의 대부분), 커밋 이메일도 담겨 있습니다.
- `node_modules/` — 다시 설치 가능한 외부 라이브러리
- 키 파일: `*-firebase-adminsdk-*.json`, `serviceAccountKey.json`, `.env` — **절대** 공유·커밋하지 않기 (`.gitignore` 에 등록해 두었습니다)
- 원본 고해상도 이미지 — 코드 검토에는 필요 없음
