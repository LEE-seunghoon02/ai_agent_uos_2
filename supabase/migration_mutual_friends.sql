-- ================================================================
-- 친구 맞팔(상호 친구) 마이그레이션
-- Supabase 대시보드 → SQL Editor 에 전체를 붙여넣고 Run 하세요.
-- A가 B를 추가하면 B의 친구목록에도 A가 자동 추가되고,
-- A가 B를 삭제하면 B의 목록에서도 A가 자동 삭제됩니다.
-- ================================================================

-- 추가 시 반대 방향 행 자동 생성
create or replace function public.sync_friend_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into friends(user_id, friend_id)
  values (new.friend_id, new.user_id)
  on conflict do nothing;   -- 이미 있으면 무시 (재귀 방지)
  return new;
end $$;

drop trigger if exists friends_mutual_insert on public.friends;
create trigger friends_mutual_insert
  after insert on public.friends
  for each row execute function public.sync_friend_insert();

-- 삭제 시 반대 방향 행 자동 삭제
create or replace function public.sync_friend_delete()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  delete from friends
  where user_id = old.friend_id and friend_id = old.user_id;
  return old;
end $$;

drop trigger if exists friends_mutual_delete on public.friends;
create trigger friends_mutual_delete
  after delete on public.friends
  for each row execute function public.sync_friend_delete();

-- 기존에 한 방향만 있던 친구 관계를 맞팔로 보정
insert into friends(user_id, friend_id)
select f.friend_id, f.user_id
from friends f
where not exists (
  select 1 from friends g
  where g.user_id = f.friend_id and g.friend_id = f.user_id
)
on conflict do nothing;
