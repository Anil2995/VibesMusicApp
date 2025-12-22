-- Create a table for public profiles using Supabase Auth
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create a table for tracks (songs)
create table public.tracks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist text not null,
  album text,
  genre text,
  duration integer, -- in seconds
  audio_url text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.tracks enable row level security;

-- Allow read access to everyone for tracks
create policy "Public tracks are viewable by everyone"
  on tracks for select
  using ( true );

-- Create a table for playlists
create table public.playlists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.playlists enable row level security;

-- Create a join table for tracks in playlists
create table public.playlist_tracks (
  id uuid default gen_random_uuid() primary key,
  playlist_id uuid references public.playlists(id) on delete cascade not null,
  track_id uuid references public.tracks(id) on delete cascade not null,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(playlist_id, track_id)
);

-- Enable RLS
alter table public.playlist_tracks enable row level security;

-- Set up Storage Buckets (Execute these in the SQL Editor or create via Dashboard)
-- insert into storage.buckets (id, name, public) values ('covers', 'covers', true);
-- insert into storage.buckets (id, name, public) values ('tracks', 'tracks', false);

-- Helper function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
