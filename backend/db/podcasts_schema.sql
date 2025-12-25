-- Create a table for podcasts
create table if not exists public.podcasts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  host text not null,
  description text,
  category text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.podcasts enable row level security;

-- Allow read access to everyone for podcasts
create policy "Public podcasts are viewable by everyone"
  on podcasts for select
  using ( true );

-- Create a table for episodes
create table if not exists public.episodes (
  id uuid default gen_random_uuid() primary key,
  podcast_id uuid references public.podcasts(id) on delete cascade not null,
  title text not null,
  description text,
  duration integer, -- in seconds
  audio_url text not null,
  episode_number integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.episodes enable row level security;

-- Allow read access to everyone for episodes
create policy "Public episodes are viewable by everyone"
  on episodes for select
  using ( true );

-- Create index for faster podcast-episode lookups
create index if not exists idx_episodes_podcast_id on public.episodes(podcast_id);
