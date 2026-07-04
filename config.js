// ===== Supabase 연동 설정 =====
// 값이 채워져 있으면 클라우드 모드(로그인/친구/단과대 TOP5 실데이터)로,
// 비워두면 로컬 모드(localStorage, 데모 친구)로 동작합니다.
// anon 키는 공개 가능한 키이며, 데이터 보안은 RLS 정책이 담당합니다.
window.SUPABASE_URL = "https://hsnkelbxppriiziiwmed.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbmtlbGJ4cHByaWl6aWl3bWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNzIwNjYsImV4cCI6MjA5ODY0ODA2Nn0.YXlNE-UjO6KkcT1_9_sZzpyjCvUA5O2fX113PAKqETY";

// ===== Google Maps (Places API New) 연동 설정 =====
// 키를 넣으면 앱 시작 시 시립대/청량리/회기 주변 식당을 구글맵에서 추가로 불러옵니다.
// Google Cloud Console에서 "Places API (New)"를 활성화한 API 키를 사용하고,
// 반드시 "HTTP 리퍼러" 제한으로 배포 도메인을 등록하세요. (비워두면 엑셀 데이터만 사용)
window.GOOGLE_MAPS_API_KEY = "";
