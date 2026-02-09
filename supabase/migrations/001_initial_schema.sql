-- NovaLearning: Database Schema (matches deployed Supabase)
-- This file documents the live schema for reproducibility.
-- Tables already exist in the deployed database.

-- ============================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'parent' CHECK (role IN ('parent', 'teacher', 'admin')),
  phone TEXT,
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. STUDENTS (children linked to a parent)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  age INTEGER CHECK (age BETWEEN 4 AND 7),
  grade TEXT DEFAULT 'R' CHECK (grade IN ('R', '1')),
  avatar_emoji TEXT DEFAULT '🦁',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. GAMES (registry of available games)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  skill_category TEXT NOT NULL CHECK (skill_category IN ('numeracy', 'literacy', 'life_skills', 'motor_skills', 'creativity')),
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  caps_outcomes TEXT[],
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed: Count to Five game
INSERT INTO public.games (slug, title, description, skill_category, difficulty_level, caps_outcomes)
VALUES ('count-to-five', 'Count to 5 with Sipho', 'Count mangoes from a tree with Sipho', 'numeracy', 1, ARRAY['Mathematics: Counting 1-5'])
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 4. GAME SESSIONS (per-play records)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT false,
  performance_data JSONB DEFAULT '{}'::jsonb,
  device_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. STUDENT PROGRESS (aggregate per skill category)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  skill_category TEXT NOT NULL,
  current_level INTEGER DEFAULT 1,
  total_games_played INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,
  mastery_percentage NUMERIC(5,2) DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, skill_category)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Parents manage own students" ON public.students
  FOR ALL USING (auth.uid() = parent_id);

CREATE POLICY "Games are publicly readable" ON public.games
  FOR SELECT USING (true);

CREATE POLICY "Parents manage own student sessions" ON public.game_sessions
  FOR ALL USING (
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );

CREATE POLICY "Parents manage own student progress" ON public.student_progress
  FOR ALL USING (
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_students_parent_id ON public.students(parent_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_student_id ON public.game_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_id ON public.game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_completed_at ON public.game_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON public.student_progress(student_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS students_updated_at ON public.students;
CREATE TRIGGER students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS student_progress_updated_at ON public.student_progress;
CREATE TRIGGER student_progress_updated_at
  BEFORE UPDATE ON public.student_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
