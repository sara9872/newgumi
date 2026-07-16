# Gogumi

> 구미·경북권 관광정보를 한곳에서 찾아보고, 익명 게시판과 AI 챗봇으로 더 쉽게 물어볼 수 있는 지역 정보 웹 서비스

한국관광공사 TourAPI 공공데이터를 기반으로 구미·경북권(구미·대구·칠곡·성주·고령)의 관광지·음식점·숙박·축제·문화시설 정보를 제공하고, 익명 게시판과 OpenAI 기반 챗봇으로 지역 정보를 더 쉽게 탐색할 수 있도록 만든 Vue 3 SPA 프로젝트입니다.

---

## 데모

- 배포 링크: _(아직 배포 전입니다. Netlify 배포 후 이 자리에 URL을 추가해주세요)_
- 스크린샷 / GIF: _(추가 예정)_

---

## 기술 스택

| 분야 | 기술 |
|---|---|
| Frontend | Vue 3 (Composition API) |
| Build Tool | Vite 5 (`scripts/dev.mjs`, `scripts/build.mjs`로 직접 실행 — 별도 `vite.config.js` 없음) |
| Routing | Vue Router 4 |
| UI Icons | Font Awesome (`@fortawesome/vue-fontawesome`) |
| Styling | CSS (`styles.css`, 별도 프레임워크 없음) |
| Package Manager | npm |
| AI | OpenAI API (`gpt-5-mini`) |
| 공공데이터 | 한국관광공사 TourAPI 4.0 (사전 수집 JSON, `public/data/`) |
| 날씨 | Open-Meteo API (무료, API 키 불필요) |
| Storage | Browser localStorage |
| Deploy | Netlify |

---

## 시작하기

### 사전 요구사항
- Node.js 18 이상
- npm 9 이상

### 설치

```bash
git clone https://github.com/alexjhlee4/newgumi.git
cd newgumi
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 만들고, `.env.example`을 참고해 아래 값을 채웁니다.

```env
VITE_OPENAI_API_KEY=your_limited_openai_api_key
```

- 실제 키 값은 절대 커밋하지 마세요. (`.env`는 `.gitignore`에 등록되어 있습니다)
- Vite 환경 변수는 빌드 시 브라우저 번들에 그대로 포함되므로, 반드시 **사용량 제한이 걸린 키**만 사용하세요.
- 배포 환경(Netlify)에서는 Site settings → Environment variables에 동일한 키를 등록해야 챗봇이 동작합니다.

### 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

---

## 구현한 기능 (MVP 기준)

### Must
- [x] Vue 3 + Vite + Vue Router 기반 SPA 구조
- [x] TourAPI 공공데이터(JSON) 연동 및 8개 카테고리(관광지/음식점/숙박/문화시설/쇼핑/레포츠/여행코스/축제) 조회
- [x] 지역 정보 검색 (이름·주소·전화번호)
- [x] 익명 게시판 CRUD (작성/조회/수정/삭제)
- [x] 비밀번호 기반 게시글 수정·삭제 확인
- [x] AI 챗봇 (OpenAI 연동, 제공 데이터 범위 내에서만 답변)

### Should
- [x] 축제 캘린더 (월별 일정, 시작일·종료일 표시, 동일 날짜 다중 행사 표시)
- [x] 게시판 검색 / 좋아요 / 북마크
- [x] 댓글 작성·수정·삭제 (비밀번호 확인)
- [x] 오늘의 날씨 위젯 (홈 화면 표시 + 챗봇 컨텍스트 연동)

---

## 프로젝트 구조

```text
src/
├── components/   # ChatBot, PlaceCard 등 재사용 컴포넌트
├── services/     # dataService(TourAPI JSON), chatService(OpenAI), weatherService(Open-Meteo)
├── stores/       # boardStore — localStorage 기반 게시판/댓글 상태 관리
├── views/        # 라우트별 화면 (Home, Places, Board, FestivalCalendar 등)
└── main.js       # 앱 진입점 및 라우터 설정

public/data/      # TourAPI 사전 수집 JSON 8종 + 출처/스키마 문서
scripts/          # Vite dev/build 실행 스크립트
docs/             # 기능 명세서, WBS, 발표자료 구성안
```

---

## 주요 화면

| 경로 | 설명 |
|---|---|
| `/` | 홈 (추천 정보, 오늘의 날씨, 최근 게시글) |
| `/places/:category?` | 지역 정보 조회 및 검색 |
| `/board` | 익명 게시판 목록 |
| `/board/new` | 게시글 작성 |
| `/board/:id` | 게시글 상세 (댓글, 좋아요, 북마크) |
| `/board/:id/edit` | 게시글 수정 |
| `/festivals` | 축제 캘린더 |

---

## 데이터 출처 및 라이선스

| 항목 | 내용 |
|---|---|
| 제공기관 | 한국관광공사 |
| 데이터명 | 국문 관광정보 서비스 (TourAPI 4.0) |
| 공공데이터포털 | https://www.data.go.kr/data/15101578/openapi.do |
| 수집 권역 | 구미·대구·칠곡·성주·고령 (구미_경북권, 총 1,667건) |
| 데이터 권한 | 공공누리 제3유형 (출처 표시, 변경 금지) |
| 저장 방식 | `public/data/*.json` 사전 수집 파일 + 브라우저 localStorage(게시판/댓글) |

> 카테고리별 상세 건수와 출처 표기 예시는 [`public/data/SOURCE.md`](public/data/SOURCE.md)를 참고하세요.

---

## 배포 정보

- Netlify 배포용 설정(`netlify.toml`, SPA 리다이렉트)이 포함되어 있어 정적 사이트로 바로 배포할 수 있습니다.
- 배포 시 Netlify 환경 변수에 `VITE_OPENAI_API_KEY`를 등록해야 챗봇이 정상 동작합니다.
- 현재 `netlify.toml`의 빌드 명령은 `pnpm build`로 되어 있습니다. 이 문서의 실행 방법은 npm 기준이므로, 배포 전 `npm run build`로 맞추거나 pnpm 배포를 유지할지 확인이 필요합니다.

---

## 팀 구성

저장소의 Git 커밋 이력을 기준으로 정리한 참여자 정보입니다.

| 이름 | GitHub | 역할 |
|---|---|---|
| 황수빈 | [@sara9872](https://github.com/sara9872) | 주요 기능 구현 및 개발 기여 |
| 이혜진 | [@forhyejinlee](https://github.com/forhyejinlee) | UI 기능 구현 및 개발 기여 |
| 이정현 | [@alexjhlee4](https://github.com/alexjhlee4) | 저장소 관리 및 프로젝트 기여 |

---

## 트러블슈팅

**1. 좋아요 버튼 클릭 시 카운트가 무한 증가하는 문제**
- 문제: 초기 구현에는 좋아요에 토글 상태가 없어, 버튼을 누를 때마다 카운트가 계속 올라갔습니다.
- 해결: 게시글마다 `liked` 상태를 추가해 클릭 시 상태를 토글하고 카운트를 ±1만 반영하도록 수정했습니다(`boardStore.js`의 `likePost`). 버튼 라벨도 상태에 따라 "좋아요" / "좋아요 취소"로 구분했습니다.

**2. OpenAI 챗봇 호출 시 400 에러 발생**
- 문제: 요청 바디에 `temperature` 값을 커스텀으로 지정했더니 API가 오류를 반환했습니다.
- 해결: 사용 중인 `gpt-5-mini` 모델이 기본값(1) 외의 `temperature`를 지원하지 않는 것을 확인하고, 요청 바디에서 `temperature` 파라미터를 제거해 해결했습니다(`chatService.js`).

---

## 참고 사항

- 프론트엔드 중심의 정적 SPA로, 별도 백엔드 서버 없이 동작합니다.
- 게시글·댓글·좋아요·북마크는 브라우저 localStorage에 저장되어 다른 기기·브라우저와는 동기화되지 않습니다.
- AI 챗봇 기능을 사용하려면 유효한 OpenAI API 키가 필요합니다.

---

## 회고

- 공공데이터, 사용자 생성 콘텐츠(게시판·댓글), 외부 API(날씨)를 한 서비스 안에서 결합해보는 경험을 할 수 있었습니다.
- AI 챗봇에 지역 데이터와 실시간 날씨를 함께 컨텍스트로 제공하면서, "제공된 데이터 범위 밖의 답변은 하지 않도록" 프롬프트를 설계하는 과정을 고민했습니다.
- 다음에는 인증, 대댓글, 서버 기반 저장소(현재는 localStorage 의존) 등으로 기능을 확장해볼 수 있습니다.
