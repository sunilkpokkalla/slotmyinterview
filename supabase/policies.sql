-- =====================================================================
-- SlotMyInterview: Row Level Security + Storage policies
-- Run once in the Supabase SQL editor AFTER the Prisma migration has created the tables,
-- and re-run after schema changes (it is idempotent).
--
-- Model
--   * The Next.js app talks to Postgres through Prisma with the privileged `postgres` role, which bypasses RLS.
--     Every Server Action checks the caller's role and ownership itself.
--   * These policies are the second lock: anything that reaches the database through the Supabase Data API
--     (anon / authenticated keys) can only do what is allowed here.
--   * Candidates (JOB_SEEKER) own their profile. Recruiters (JOB_PROVIDER) can read public profiles but can never
--     write to a candidate's rows. Nobody can change roles, scores or webhook secrets from the client.
-- =====================================================================

-- ---------- Helper functions (SECURITY DEFINER avoids RLS recursion on "User") ----------
create schema if not exists app;
revoke all on schema app from public;
grant usage on schema app to anon, authenticated;

create or replace function app.current_user_id() returns text
language sql stable security definer set search_path = public as $$
  select id from "User" where "authUserId" = auth.uid()::text limit 1
$$;

create or replace function app.current_role() returns text
language sql stable security definer set search_path = public as $$
  select role::text from "User" where "authUserId" = auth.uid()::text limit 1
$$;

create or replace function app.current_seeker_id() returns text
language sql stable security definer set search_path = public as $$
  select sp.id from "SeekerProfile" sp join "User" u on u.id = sp."userId"
  where u."authUserId" = auth.uid()::text and u.role = 'JOB_SEEKER' limit 1
$$;

create or replace function app.current_provider_id() returns text
language sql stable security definer set search_path = public as $$
  select pp.id from "ProviderProfile" pp join "User" u on u.id = pp."userId"
  where u."authUserId" = auth.uid()::text and u.role = 'JOB_PROVIDER' limit 1
$$;

grant execute on all functions in schema app to anon, authenticated;

-- ---------- Start from zero privileges for client roles, then grant narrowly ----------
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Drop our previous policies so this file can be re-run.
do $$
declare p record;
begin
  for p in select schemaname, tablename, policyname from pg_policies where schemaname = 'public' and policyname like 'smi\_%' escape '\' loop
    execute format('drop policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;

-- ---------- User: read your own row only. No client writes (roles can't be self-assigned). ----------
grant select on "User" to authenticated;
create policy smi_user_select_own on "User" for select to authenticated
  using ("authUserId" = auth.uid()::text);

-- ---------- Skill taxonomy: public read, no client writes ----------
grant select on "SkillCategory", "Skill" to anon, authenticated;
create policy smi_skillcategory_read on "SkillCategory" for select to anon, authenticated using (true);
create policy smi_skill_read on "Skill" for select to anon, authenticated using (true);

-- ---------- SeekerProfile: public read, owner-only update ----------
-- Column-level grants keep the Cal.com webhook secret private and stop clients editing scores.
grant select (id, "userId", username, "fullName", "photoUrl", headline, bio, location, "workAuthType", availability,
              "nonTechSkills", "videoPitchPath", "videoPitchDurationSec", "videoPitchUpdatedAt", "calcomLink",
              "compositeScore", "githubScore", "assessmentScore", "completenessScore", "endorsementScore",
              "lastScoredAt", "createdAt", "updatedAt")
  on "SeekerProfile" to anon, authenticated;
grant select ("alertFrequencyMaxPerWeek", "alertsPaused") on "SeekerProfile" to authenticated;
grant update ("fullName", "photoUrl", headline, bio, location, "workAuthType", availability, "nonTechSkills",
              "calcomLink", "alertFrequencyMaxPerWeek", "alertsPaused")
  on "SeekerProfile" to authenticated;

create policy smi_seeker_read on "SeekerProfile" for select to anon, authenticated using (true);
create policy smi_seeker_update_own on "SeekerProfile" for update to authenticated
  using (id = app.current_seeker_id()) with check (id = app.current_seeker_id());

-- ---------- Candidate-owned child tables: public read, owner-only writes ----------
grant select on "SeekerSkill", "Experience", "PortfolioLink", "SocialProfile" to anon, authenticated;
grant insert, update, delete on "SeekerSkill", "Experience", "PortfolioLink", "SocialProfile" to authenticated;

create policy smi_seekerskill_read on "SeekerSkill" for select to anon, authenticated using (true);
create policy smi_seekerskill_write on "SeekerSkill" for all to authenticated
  using ("seekerId" = app.current_seeker_id()) with check ("seekerId" = app.current_seeker_id());

create policy smi_experience_read on "Experience" for select to anon, authenticated using (true);
create policy smi_experience_write on "Experience" for all to authenticated
  using ("seekerId" = app.current_seeker_id()) with check ("seekerId" = app.current_seeker_id());

create policy smi_portfolio_read on "PortfolioLink" for select to anon, authenticated using (true);
create policy smi_portfolio_write on "PortfolioLink" for all to authenticated
  using ("seekerId" = app.current_seeker_id()) with check ("seekerId" = app.current_seeker_id());

create policy smi_social_read on "SocialProfile" for select to anon, authenticated using (true);
create policy smi_social_write on "SocialProfile" for all to authenticated
  using ("seekerId" = app.current_seeker_id()) with check ("seekerId" = app.current_seeker_id());

-- ---------- Endorsements: public read; a candidate can give (not to themselves) and withdraw their own ----------
grant select on "Endorsement" to anon, authenticated;
grant insert, delete on "Endorsement" to authenticated;
create policy smi_endorsement_read on "Endorsement" for select to anon, authenticated using (true);
create policy smi_endorsement_insert on "Endorsement" for insert to authenticated
  with check ("endorserId" = app.current_seeker_id() and "seekerId" <> "endorserId");
create policy smi_endorsement_delete on "Endorsement" for delete to authenticated
  using ("endorserId" = app.current_seeker_id());

-- ---------- ProviderProfile: public company info, owner-only update ----------
grant select on "ProviderProfile" to anon, authenticated;
grant update ("companyName", "logoUrl", website, description, location) on "ProviderProfile" to authenticated;
create policy smi_provider_read on "ProviderProfile" for select to anon, authenticated using (true);
create policy smi_provider_update_own on "ProviderProfile" for update to authenticated
  using (id = app.current_provider_id()) with check (id = app.current_provider_id());

-- ---------- Jobs: active jobs are public; recruiters manage their own ----------
grant select on "Job" to anon, authenticated;
grant insert, update, delete on "Job" to authenticated;
create policy smi_job_read on "Job" for select to anon, authenticated
  using ("isActive" or "providerId" = app.current_provider_id());
create policy smi_job_write on "Job" for all to authenticated
  using ("providerId" = app.current_provider_id()) with check ("providerId" = app.current_provider_id());

-- Prisma's implicit many-to-many tables (readable; written by the server only)
grant select on "_JobRequiredSkills", "_JobPreferredSkills" to anon, authenticated;
create policy smi_jobreq_read on "_JobRequiredSkills" for select to anon, authenticated using (true);
create policy smi_jobpref_read on "_JobPreferredSkills" for select to anon, authenticated using (true);

-- ---------- Submissions (applications) ----------
-- Recruiter notes are private: not selectable through the Data API at all (the server reads them for the recruiter).
grant select (id, "jobId", "seekerId", stage, "coverNote", "createdAt", "updatedAt") on "Submission" to authenticated;
grant insert (id, "jobId", "seekerId", "coverNote", "updatedAt") on "Submission" to authenticated;
grant update (stage, notes, "updatedAt") on "Submission" to authenticated;

create policy smi_submission_read on "Submission" for select to authenticated
  using ("seekerId" = app.current_seeker_id()
         or exists (select 1 from "Job" j where j.id = "jobId" and j."providerId" = app.current_provider_id()));
create policy smi_submission_apply on "Submission" for insert to authenticated
  with check ("seekerId" = app.current_seeker_id() and stage = 'SUBMITTED'
              and exists (select 1 from "Job" j where j.id = "jobId" and j."isActive"));
-- Recruiters move candidates through the pipeline for their own jobs only.
create policy smi_submission_provider_update on "Submission" for update to authenticated
  using (exists (select 1 from "Job" j where j.id = "jobId" and j."providerId" = app.current_provider_id()))
  with check (exists (select 1 from "Job" j where j.id = "jobId" and j."providerId" = app.current_provider_id()));

-- ---------- Candidate tasks ----------
grant select on "CandidateTask" to authenticated;
grant insert, update on "CandidateTask" to authenticated;  -- policies below limit this to the recruiter who owns the job

create policy smi_task_read on "CandidateTask" for select to authenticated
  using (exists (select 1 from "Submission" s join "Job" j on j.id = s."jobId"
                 where s.id = "submissionId" and (s."seekerId" = app.current_seeker_id() or j."providerId" = app.current_provider_id())));
create policy smi_task_provider_write on "CandidateTask" for all to authenticated
  using (exists (select 1 from "Submission" s join "Job" j on j.id = s."jobId" where s.id = "submissionId" and j."providerId" = app.current_provider_id()))
  with check (exists (select 1 from "Submission" s join "Job" j on j.id = s."jobId" where s.id = "submissionId" and j."providerId" = app.current_provider_id()));
-- Candidates hand in solutions through the Server Action only (so they can never touch scores or feedback).

-- ---------- Interview slots and bookings ----------
grant select on "InterviewSlot", "InterviewBooking" to authenticated;
grant insert, update, delete on "InterviewSlot" to authenticated;

create policy smi_slot_read on "InterviewSlot" for select to authenticated
  using (exists (select 1 from "Job" j where j.id = "jobId" and j."providerId" = app.current_provider_id())
         or exists (select 1 from "Submission" s where s."jobId" = "InterviewSlot"."jobId" and s."seekerId" = app.current_seeker_id()));
create policy smi_slot_write on "InterviewSlot" for all to authenticated
  using (exists (select 1 from "Job" j where j.id = "jobId" and j."providerId" = app.current_provider_id()))
  with check (exists (select 1 from "Job" j where j.id = "jobId" and j."providerId" = app.current_provider_id()));

-- Bookings are created by the server (atomic slot claim), never by the client.
create policy smi_booking_read on "InterviewBooking" for select to authenticated
  using (exists (select 1 from "Submission" s where s.id = "submissionId" and s."seekerId" = app.current_seeker_id())
         or exists (select 1 from "InterviewSlot" sl join "Job" j on j.id = sl."jobId" where sl.id = "slotId" and j."providerId" = app.current_provider_id()));

-- ---------- Job alerts: candidates read their own history ----------
grant select on "JobAlertDispatch" to authenticated;
create policy smi_alert_read on "JobAlertDispatch" for select to authenticated using ("seekerId" = app.current_seeker_id());

-- ---------- Cal.com bookings: the candidate and the recruiter who booked ----------
grant select on "CalBooking" to authenticated;
create policy smi_calbooking_read on "CalBooking" for select to authenticated
  using ("seekerId" = app.current_seeker_id() or "recruiterUserId" = app.current_user_id());

-- ---------- Lead + migrations table: RLS on, no client access at all ----------
-- (the public lead form posts through a Server Action using the server connection)

-- =====================================================================
-- Storage: 60-second video pitches
-- Public bucket (pitches are shown on public profiles). Only the owner can write inside their own folder:
--   <auth user id>/<file>
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pitch-videos', 'pitch-videos', true, 104857600, array['video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update
  set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists smi_pitch_read on storage.objects;
drop policy if exists smi_pitch_insert on storage.objects;
drop policy if exists smi_pitch_update on storage.objects;
drop policy if exists smi_pitch_delete on storage.objects;

create policy smi_pitch_read on storage.objects for select to anon, authenticated
  using (bucket_id = 'pitch-videos');
create policy smi_pitch_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'pitch-videos' and (storage.foldername(name))[1] = auth.uid()::text and app.current_role() = 'JOB_SEEKER');
create policy smi_pitch_update on storage.objects for update to authenticated
  using (bucket_id = 'pitch-videos' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'pitch-videos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy smi_pitch_delete on storage.objects for delete to authenticated
  using (bucket_id = 'pitch-videos' and (storage.foldername(name))[1] = auth.uid()::text);
