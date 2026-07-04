# 이루매 🦅 — 서울시립대 식당 추천 서비스

서울시립대학교 학생/교직원을 위한 식사 메뉴 추천 웹앱입니다.
프로필과 그날의 선택(카테고리·거리)을 종합해 학교 주변 55개 식당 중 TOP 5를 추천합니다.

## 기능

- **홈**: UOS 마크 + 이루매 캐릭터, 시작하기 버튼
- **뽑기 (5단계)**: 싱글/멀티 → 오늘 땡겨요 → 오늘 안돼요 → 거리 조절(시립대/청량리/회기) → TOP 5 + 랜덤박스
- **맛집 사전**: 지역별 전체 식당 / 단과대별 선택 TOP 5
- **설정**: 프로필, 친구목록(ID 추가·초대 링크), 문의하기, 다크모드/로그아웃

## 동작 모드

| 모드 | 조건 | 저장소 |
|---|---|---|
| 로컬 모드 | `config.js`의 키가 비어 있음 | localStorage (데모 친구 3명 포함) |
| 클라우드 모드 | `config.js`에 Supabase 키 입력 | Supabase (이메일 로그인, 실제 친구/기록) |

## 배포 방법

### 1. Supabase 설정

1. [supabase.com](https://supabase.com)에서 새 프로젝트를 만든다.
2. **SQL Editor**에 `supabase/schema.sql` 내용을 붙여넣고 실행한다.
3. (수업용 추천) **Authentication → Sign In / Up → Email**에서 `Confirm email`을 끈다.
   켜 둘 경우 **Authentication → URL Configuration**의 Site URL을 배포 주소로 설정한다.
4. **Project Settings → API**에서 `Project URL`과 `anon public` 키를 복사해 `config.js`에 넣는다.

```js
window.SUPABASE_URL = "https://xxxx.supabase.co";
window.SUPABASE_ANON_KEY = "eyJ...";
```

> anon 키는 공개되어도 되는 키입니다(보안은 RLS 정책이 담당).

### 2. (선택) 구글맵 실시간 데이터 연동

엑셀 55곳 외에 구글맵의 주변 식당을 추가로 불러오려면:

1. [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트 생성 (결제 계정 필요 — 월 무료 할당량 내에서는 과금 없음)
2. **API 및 서비스 → 라이브러리**에서 **Places API (New)** 활성화
3. **사용자 인증 정보**에서 API 키 생성
4. 키 제한 설정: **HTTP 리퍼러** 제한에 배포 주소(`https://<계정>.github.io/*`) 등록, API 제한은 Places API (New)만 허용
5. `config.js`의 `GOOGLE_MAPS_API_KEY`에 키 입력

앱 시작 시 시립대/청량리/회기 반경 600m의 식당을 각 20곳까지 불러와 병합합니다
(24시간 localStorage 캐시로 호출량 절약). 구글맵 식당은 메뉴/가격 정보가 없어
정보 팝업에서 지도 링크로 안내합니다.

### 3. GitHub Pages 배포

1. `config.js` 수정 후 커밋 & 푸시
2. GitHub 저장소 → **Settings → Pages**
3. Source: **Deploy from a branch**, Branch: **main / (root)** 선택 후 Save
4. 1~2분 뒤 `https://<계정명>.github.io/ai_agent_uos_2/` 에서 접속 가능

## 로컬 개발

`index.html`을 브라우저로 직접 열거나, PowerShell에서:

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1   # http://localhost:8123
```

## 데이터 출처

`식당목록.xlsx` (수집일 2026-07-03, Google Places 기반, 55개 식당).
메뉴 가격은 추정치로 실제와 다를 수 있습니다.
