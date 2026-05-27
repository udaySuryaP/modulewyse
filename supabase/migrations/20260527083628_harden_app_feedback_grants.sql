revoke all
on public.app_feedback
from public;

revoke all
on public.app_feedback
from anon;

revoke all
on public.app_feedback
from authenticated;

grant select, insert
on public.app_feedback
to authenticated;
