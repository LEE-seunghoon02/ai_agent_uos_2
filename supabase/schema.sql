-- ================================================================
-- 이루매 (서울시립대 식당 추천) Supabase 스키마
-- Supabase 대시보드 → SQL Editor 에 전체를 붙여넣고 Run 하세요.
-- ================================================================

-- 프로필 (auth.users 1:1)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  name text not null,
  year int,
  gender text,
  college text,
  pref text[] default '{}',
  cant text default '',
  allergy text default '',
  created_at timestamptz default now()
);

-- 친구 (단방향: user_id 의 친구목록에 friend_id 가 있음)
create table public.friends (
  user_id uuid not null references public.profiles(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, friend_id)
);

-- 최종 선택 기록 (단과대별 TOP5 집계용)
create table public.picks (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  restaurant_id int not null,
  college text,
  created_at timestamptz default now()
);

-- ---------------- Row Level Security ----------------
alter table public.profiles enable row level security;
alter table public.friends enable row level security;
alter table public.picks enable row level security;

-- 프로필: 로그인 사용자는 모두 조회 가능(친구 검색용), 본인 것만 생성/수정
create policy "profiles_select" on public.profiles
  for select to authenticated using (true);
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- 친구: 본인 목록만 조회/추가/삭제
create policy "friends_select_own" on public.friends
  for select to authenticated using (auth.uid() = user_id);
create policy "friends_insert_own" on public.friends
  for insert to authenticated with check (auth.uid() = user_id);
create policy "friends_delete_own" on public.friends
  for delete to authenticated using (auth.uid() = user_id);

-- 선택 기록: 본인 것만 추가, 조회는 로그인 사용자 전체(집계용)
create policy "picks_select" on public.picks
  for select to authenticated using (true);
create policy "picks_insert_own" on public.picks
  for insert to authenticated with check (auth.uid() = user_id);

-- ---------------- 단과대별 TOP5 집계 함수 ----------------
create or replace function public.college_top5(college_name text)
returns table(restaurant_id int, cnt bigint)
language sql stable security definer set search_path = public as $$
  select restaurant_id, count(*) as cnt
  from picks
  where college = college_name
  group by restaurant_id
  order by cnt desc, restaurant_id
  limit 5;
$$;
grant execute on function public.college_top5(text) to authenticated;
