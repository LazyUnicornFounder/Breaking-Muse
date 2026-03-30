-- Create table for daily generated ideas
CREATE TABLE public.daily_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  tag TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source_event TEXT NOT NULL,
  source_url TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast date + tag lookups
CREATE INDEX idx_daily_ideas_date ON public.daily_ideas (date DESC);
CREATE INDEX idx_daily_ideas_date_tag ON public.daily_ideas (date, tag);

-- Unique constraint to avoid duplicate ideas per day/tag/title
CREATE UNIQUE INDEX idx_daily_ideas_unique ON public.daily_ideas (date, tag, title);

-- Enable RLS (public read, only service role can write)
ALTER TABLE public.daily_ideas ENABLE ROW LEVEL SECURITY;

-- Anyone can read ideas
CREATE POLICY "Ideas are publicly readable"
  ON public.daily_ideas FOR SELECT
  USING (true);