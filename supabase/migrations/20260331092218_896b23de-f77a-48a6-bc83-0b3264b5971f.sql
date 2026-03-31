
create table public.reddit_ideas (
  id uuid primary key default gen_random_uuid(),
  date text not null,
  tag text not null,
  title text not null,
  description text not null,
  source_event text not null,
  source_url text not null,
  is_featured boolean default false,
  created_at timestamptz default now(),
  unique(date, tag, title)
);
alter table public.reddit_ideas enable row level security;
create policy "Reddit ideas are publicly readable" on public.reddit_ideas for select to public using (true);

create table public.reddit_ideas_errors (
  id uuid primary key default gen_random_uuid(),
  category text,
  error text,
  created_at timestamptz default now()
);
alter table public.reddit_ideas_errors enable row level security;
