-- Enable UUID
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists profiles(
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text,
  ui_prefs jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Workspaces
create table if not exists workspaces(
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  base_lang text not null,
  target_lang text not null,
  title text,
  created_at timestamptz default now(),
  unique(user_id, base_lang, target_lang)
);

-- Words
create table if not exists words(
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  language text not null,
  lemma text not null,
  created_at timestamptz default now()
);

-- Senses
create table if not exists senses(
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id uuid not null references words(id) on delete cascade,
  translation text not null,
  example jsonb default '[]'::jsonb,
  pos text,
  ipa text,
  audio_url text,
  tags text[],
  created_at timestamptz default now()
);

-- Reviews
create table if not exists reviews(
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sense_id uuid not null references senses(id) on delete cascade,
  direction text not null check (direction in ('A2B','B2A')),
  next_review date not null default current_date,
  interval_days int not null default 1,
  ease_factor numeric not null default 2.5,
  repetition_count int not null default 0,
  last_result text,
  updated_at timestamptz default now()
);

-- Links
create table if not exists links(
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  sense_id_a uuid not null references senses(id) on delete cascade,
  sense_id_b uuid not null references senses(id) on delete cascade,
  relation_type text not null check (relation_type in ('synonym','antonym','related','idiom','grammar')),
  created_at timestamptz default now()
);

-- Dismissed suggestions
create table if not exists dismissed_suggestions(
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  lemma text not null,
  created_at timestamptz default now()
);

-- Public freq (read-only)
create table if not exists freq_words(
  id serial primary key,
  language text not null,
  lemma text not null,
  rank int not null,
  pos text,
  freq numeric
);

-- RLS
alter table profiles enable row level security;
alter table workspaces enable row level security;
alter table words enable row level security;
alter table senses enable row level security;
alter table reviews enable row level security;
alter table links enable row level security;
alter table dismissed_suggestions enable row level security;
alter table freq_words enable row level security;

-- Policies
create policy "own profiles" on profiles for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own workspaces" on workspaces for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own words" on words for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own senses" on senses for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own reviews" on reviews for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own links" on links for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own dismissed" on dismissed_suggestions for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Read-only freq words to all (optional: restrict)
create policy "public freq read" on freq_words for select using (true);
