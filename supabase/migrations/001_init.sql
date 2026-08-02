-- Bachat baseline schema
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique not null,
  full_name text not null,
  age integer,
  gender text,
  monthly_income numeric,
  occupation text,
  state text,
  social_category text,
  preferred_language text default 'hi',
  consent boolean default false,
  phone text,
  email text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.schemes (
  id uuid primary key default gen_random_uuid(),
  scheme_name text not null,
  description text,
  eligibility text,
  benefits text,
  application_process text,
  official_url text,
  state text,
  category text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default now()
);

alter table public.users enable row level security;
alter table public.schemes enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Policies (removed 'IF NOT EXISTS' keywords)
drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = auth_id);

drop policy if exists "Users can insert own profile" on public.users;
create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = auth_id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = auth_id);

drop policy if exists "Schemes are readable by everyone" on public.schemes;
create policy "Schemes are readable by everyone"
  on public.schemes for select
  using (true);

drop policy if exists "Users can read own chat sessions" on public.chat_sessions;
create policy "Users can read own chat sessions"
  on public.chat_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own chat sessions" on public.chat_sessions;
create policy "Users can insert own chat sessions"
  on public.chat_sessions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own chat messages" on public.chat_messages;
create policy "Users can read own chat messages"
  on public.chat_messages for select
  using (
    exists (
      select 1
      from public.chat_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own chat messages" on public.chat_messages;
create policy "Users can insert own chat messages"
  on public.chat_messages for insert
  with check (
    exists (
      select 1
      from public.chat_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

-- Indexes
create index if not exists users_auth_id_idx on public.users(auth_id);
create index if not exists users_state_idx on public.users(state);
create index if not exists users_occupation_idx on public.users(occupation);
create index if not exists schemes_state_idx on public.schemes(state);
create index if not exists schemes_category_idx on public.schemes(category);
create index if not exists chat_sessions_user_id_idx on public.chat_sessions(user_id);
create index if not exists chat_messages_session_id_idx on public.chat_messages(session_id);