-- FACE-CAM AI — Supabase schema
-- Exécuter dans Supabase SQL Editor. RLS activé par défaut.

-- profiles (étend auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  subscription_tier text not null default 'free' check (subscription_tier in ('free','pro','premium')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- avatars
create table if not exists public.avatars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  category text not null check (category in ('realistic','professional','cinematic','artistic','futuristic','virtual')),
  thumbnail_url text,
  image_url text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.avatars enable row level security;
create policy "Anyone can view public avatars" on public.avatars for select using (is_public = true or auth.uid() = user_id);
create policy "Users can manage own avatars" on public.avatars for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user_projects
create table if not exists public.user_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  type text not null check (type in ('swap','restyle','translate')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.user_projects enable row level security;
create policy "Users can manage own projects" on public.user_projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- transformations
create table if not exists public.transformations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  avatar_id uuid references public.avatars(id) on delete set null,
  reference_image_url text,
  status text not null default 'pending' check (status in ('pending','processing','completed','failed')),
  created_at timestamptz not null default now()
);
alter table public.transformations enable row level security;
create policy "Users can manage own transformations" on public.transformations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- translation_sessions
create table if not exists public.translation_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_lang text not null,
  target_lang text not null,
  transcript text,
  translation text,
  created_at timestamptz not null default now()
);
alter table public.translation_sessions enable row level security;
create policy "Users can manage own sessions" on public.translation_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- usage_records
create table if not exists public.usage_records (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  minutes_used int not null default 0,
  quota_minutes int not null default 300,
  transformations_used int not null default 0,
  quota_transformations int not null default 100,
  updated_at timestamptz not null default now()
);
alter table public.usage_records enable row level security;
create policy "Users can view own usage" on public.usage_records for select using (auth.uid() = user_id);

-- subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tier text not null check (tier in ('free','pro','premium')),
  provider text,
  provider_subscription_id text,
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create policy "Users can view own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);

-- processing_jobs (for GPU server delegation)
create table if not exists public.processing_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued','running','completed','failed')),
  result_url text,
  created_at timestamptz not null default now()
);
alter table public.processing_jobs enable row level security;
create policy "Users can view own jobs" on public.processing_jobs for select using (auth.uid() = user_id);
create policy "Users can create own jobs" on public.processing_jobs for insert with check (auth.uid() = user_id);

-- application_settings
create table if not exists public.application_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
-- Storage bucket for reference images (à créer via dashboard Supabase Storage)
-- bucket: facecam-references (private, RLS + signed URLs)
