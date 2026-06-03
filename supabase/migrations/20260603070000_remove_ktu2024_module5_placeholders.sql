-- Remove legacy KTU 2024 Module 5 placeholders and prevent recurrence.

begin;

alter table public.subjects
add column if not exists scheme text not null default '2024';

update public.subjects
set scheme = '2024'
where scheme is null or btrim(scheme) = '';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'subjects_scheme_check'
      and conrelid = 'public.subjects'::regclass
  ) then
    alter table public.subjects
    add constraint subjects_scheme_check
      check (scheme ~ '^[0-9]{4}$');
  end if;
end;
$$;

do $$
declare
  dependent_module_count integer;
begin
  select count(*)
  into dependent_module_count
  from public.modules m
  join public.subjects s
    on s.id = m.subject_id
  where s.scheme = '2024'
    and m.module_number >= 5
    and (
      exists (
        select 1
        from public.topics t
        where t.module_id = m.id
      )
      or exists (
        select 1
        from public.content_sources cs
        where cs.module_id = m.id
      )
      or exists (
        select 1
        from public.content_chunks cc
        where cc.module_id = m.id
      )
      or exists (
        select 1
        from public.previous_questions pq
        where pq.module_id = m.id
      )
    );

  if dependent_module_count > 0 then
    raise exception
      'Cannot remove KTU 2024 Module 5+ rows because dependent academic records exist.';
  end if;
end;
$$;

delete from public.modules m
using public.subjects s
where m.subject_id = s.id
  and s.scheme = '2024'
  and m.module_number >= 5;

create or replace function public.prevent_ktu2024_outside_scheme_modules()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  subject_scheme text;
begin
  select scheme
  into subject_scheme
  from public.subjects
  where id = new.subject_id;

  if subject_scheme = '2024' and new.module_number >= 5 then
    raise exception 'Module 5 is not part of the KTU 2024 scheme.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all on function public.prevent_ktu2024_outside_scheme_modules() from public;
revoke all on function public.prevent_ktu2024_outside_scheme_modules() from anon;
revoke all on function public.prevent_ktu2024_outside_scheme_modules() from authenticated;

drop trigger if exists prevent_ktu2024_outside_scheme_modules on public.modules;
create trigger prevent_ktu2024_outside_scheme_modules
before insert or update of subject_id, module_number on public.modules
for each row
execute function public.prevent_ktu2024_outside_scheme_modules();

commit;
