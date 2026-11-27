-- ==============================================================================
-- BOLA NA REDE: CARREIRA - DATABASE SCHEMA OFICIAL (SUPABASE POSTGRESQL + RLS)
-- ==============================================================================

-- 1. Perfis de Usuário
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  plan text default 'free' check (plan in ('free', 'pro')),
  theme_pref text default 'dark' check (theme_pref in ('dark', 'light')),
  created_at timestamptz default now()
);

-- 2. Saves na Nuvem
create table if not exists public.saves (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  slot_name text not null,
  current_mode text not null check (current_mode in ('player', 'manager')),
  season_year int not null default 2026,
  generation int not null default 1,
  game_state jsonb not null,
  updated_at timestamptz default now()
);

-- 3. Ranking Online (separado por modo e baseado em troféus)
create table if not exists public.leaderboard (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  username text not null,
  mode text not null check (mode in ('player', 'manager')),
  trophies_count int not null default 0,
  points int not null default 0,
  club_name text,
  season_year int not null default 2026,
  updated_at timestamptz default now(),
  unique(user_id, mode)
);

-- 4. Pacotes da Comunidade (Editor de Times)
create table if not exists public.community_packs (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete set null,
  name text not null,
  description text,
  data jsonb not null,
  downloads int not null default 0,
  created_at timestamptz default now()
);

-- Segurança (Row Level Security)
alter table public.profiles enable row level security;
alter table public.saves enable row level security;
alter table public.leaderboard enable row level security;
alter table public.community_packs enable row level security;

-- Políticas de Acesso
create policy "Perfis públicos para leitura" on public.profiles for select using (true);
create policy "Usuário edita o próprio perfil" on public.profiles for update using (auth.uid() = id);
create policy "Usuário cria o próprio perfil" on public.profiles for insert with check (auth.uid() = id and plan = 'free');
revoke update (plan) on public.profiles from authenticated, anon;

create policy "Usuário acessa apenas seus saves" on public.saves for all using (auth.uid() = user_id);

create policy "Ranking público para leitura" on public.leaderboard for select using (true);
create policy "Usuário atualiza seu próprio ranking" on public.leaderboard for all using (auth.uid() = user_id);

create policy "Pacotes da comunidade públicos" on public.community_packs for select using (true);
create policy "Usuários logados criam pacotes" on public.community_packs for insert with check (auth.uid() = author_id);
