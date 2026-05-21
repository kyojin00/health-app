-- ============================================
-- 특수건강진단 관리 시스템 - 스키마
-- ============================================

-- 부서
create table if not exists departments (
  id serial primary key,
  name text unique not null,
  created_at timestamptz default now()
);

-- 근로자
create table if not exists workers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department_id integer references departments(id) on delete set null,
  is_foreign boolean default false,
  active boolean default true,
  notes text,
  -- 자동 계산되거나 수동으로 지정되는 검진 주기 (개월)
  cycle_months integer default 12,
  cycle_locked boolean default false, -- true면 자동 계산 무시
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists workers_name_idx on workers(name);
create index if not exists workers_department_idx on workers(department_id);

-- 검진 기록
create table if not exists examinations (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid references workers(id) on delete cascade,
  exam_date date not null,
  -- 내원검진 / 출장검진
  exam_form text check (exam_form in ('내원검진', '출장검진')),
  -- 배치전검진, 특수검진, 일반검진, 일반+특수, 기타검진, 야간작업
  exam_kind text,
  exam_round integer default 1, -- 1차, 2차
  -- 검진구분: 배치전, 일반, 특수, 일반+특수, 기타, 야간
  exam_category text,
  -- 원본 유해인자 텍스트 (+로 구분된 리스트)
  factors_raw text,
  -- 자동으로 계산된 이 검진의 주기 (개월). null이면 일반검진
  cycle_months integer,
  notes text,
  created_at timestamptz default now()
);

create index if not exists exam_worker_idx on examinations(worker_id);
create index if not exists exam_date_idx on examinations(exam_date desc);

-- updated_at 트리거
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_workers_updated on workers;
create trigger trg_workers_updated
  before update on workers
  for each row execute function set_updated_at();

-- 근로자별 마지막 특수검진 + 다음 예정일 뷰
create or replace view worker_status as
with last_special as (
  select distinct on (worker_id)
    worker_id,
    exam_date as last_exam_date,
    cycle_months as last_cycle_months,
    factors_raw,
    exam_category
  from examinations
  where exam_category in ('특수', '일반+특수', '배치전')
  order by worker_id, exam_date desc
),
last_any as (
  select distinct on (worker_id)
    worker_id,
    exam_date as last_any_date
  from examinations
  order by worker_id, exam_date desc
)
select
  w.id,
  w.name,
  w.department_id,
  d.name as department_name,
  w.is_foreign,
  w.active,
  w.cycle_months,
  w.cycle_locked,
  ls.last_exam_date,
  ls.factors_raw as last_factors,
  ls.exam_category as last_category,
  la.last_any_date,
  case
    when ls.last_exam_date is null then null
    else (ls.last_exam_date + (w.cycle_months || ' months')::interval)::date
  end as next_due_date,
  case
    when ls.last_exam_date is null then null
    else ((ls.last_exam_date + (w.cycle_months || ' months')::interval)::date - current_date)
  end as days_until_due
from workers w
left join departments d on d.id = w.department_id
left join last_special ls on ls.worker_id = w.id
left join last_any la on la.worker_id = w.id;

-- RLS - 공개 (단일 비밀번호 인증을 앱 레벨에서 처리)
alter table departments enable row level security;
alter table workers enable row level security;
alter table examinations enable row level security;

drop policy if exists "anon all" on departments;
create policy "anon all" on departments for all using (true) with check (true);

drop policy if exists "anon all" on workers;
create policy "anon all" on workers for all using (true) with check (true);

drop policy if exists "anon all" on examinations;
create policy "anon all" on examinations for all using (true) with check (true);
