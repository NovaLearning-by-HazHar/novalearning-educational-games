-- NovaLearning Phase 3: Initial Database Schema
-- Run in Supabase SQL Editor or via migration tool

-- Public profile extension for auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role TEXT DEFAULT 'parent' CHECK (role IN ('parent', 'teacher', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Children linked to a parent
CREATE TABLE IF NOT EXISTS public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  age_years INTEGER CHECK (age_years BETWEEN 4 AND 7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game progress (synced from Zustand progressStore)
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  interactions INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER,
  phases_visited TEXT[],
  device_tier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security: parents see only their own data
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Parents manage own children" ON public.children
  FOR ALL USING (auth.uid() = parent_id);

CREATE POLICY "Parents manage own children progress" ON public.progress
  FOR ALL USING (
    child_id IN (
      SELECT id FROM public.children WHERE parent_id = auth.uid()
    )
  );

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_progress_child_id ON public.progress(child_id);
CREATE INDEX IF NOT EXISTS idx_progress_game_id ON public.progress(game_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed_at ON public.progress(completed_at);
CREATE INDEX IF NOT EXISTS idx_children_parent_id ON public.children(parent_id);

-- Auto-create profile on user signup (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
