-- ============================================================
-- ClausePilot — Supabase Database Schema
-- Run this ENTIRE script in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste → Run)
-- ============================================================

-- 0. USER PROFILES TABLE (Mirrors and stores all registered users in public schema)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'Legal Counsel & Admin',
  organization TEXT DEFAULT 'ClausePilot User',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile row whenever a user registers in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 1. CONTRACTS TABLE
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  file_name TEXT,
  file_url TEXT,
  file_size TEXT,
  file_type TEXT,
  raw_text TEXT,
  category TEXT,
  priority TEXT DEFAULT 'Normal',
  status TEXT DEFAULT 'Active',
  -- AI-extracted metadata
  summary TEXT,
  contract_type TEXT,
  parties JSONB DEFAULT '[]'::jsonb,
  effective_date TEXT,
  expiration_date TEXT,
  renewal_terms TEXT,
  payment_terms TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. OBLIGATIONS TABLE
CREATE TABLE IF NOT EXISTS public.obligations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  responsible_party TEXT,
  due_date TEXT,
  status TEXT DEFAULT 'Upcoming',
  category TEXT,
  source_page TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RISKS TABLE
CREATE TABLE IF NOT EXISTS public.risks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'Medium',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CHAT HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. ACTIVITY LOG TABLE
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Each user can only see/edit their own data
-- ============================================================

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Contracts: users can CRUD their own
CREATE POLICY "Users can view own contracts" ON public.contracts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contracts" ON public.contracts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contracts" ON public.contracts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contracts" ON public.contracts FOR DELETE USING (auth.uid() = user_id);

-- Obligations: users can access obligations of their contracts
CREATE POLICY "Users can view own obligations" ON public.obligations FOR SELECT USING (
  contract_id IN (SELECT id FROM public.contracts WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert own obligations" ON public.obligations FOR INSERT WITH CHECK (
  contract_id IN (SELECT id FROM public.contracts WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update own obligations" ON public.obligations FOR UPDATE USING (
  contract_id IN (SELECT id FROM public.contracts WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete own obligations" ON public.obligations FOR DELETE USING (
  contract_id IN (SELECT id FROM public.contracts WHERE user_id = auth.uid())
);

-- Risks: same pattern
CREATE POLICY "Users can view own risks" ON public.risks FOR SELECT USING (
  contract_id IN (SELECT id FROM public.contracts WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert own risks" ON public.risks FOR INSERT WITH CHECK (
  contract_id IN (SELECT id FROM public.contracts WHERE user_id = auth.uid())
);

-- Chat history: same pattern
CREATE POLICY "Users can view own chats" ON public.chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chats" ON public.chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity log: same pattern
CREATE POLICY "Users can view own activity" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SUPABASE STORAGE BUCKET FOR CONTRACT FILES
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: users can upload/read their own files
CREATE POLICY "Users can upload contract files" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'contracts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read own contract files" ON storage.objects FOR SELECT
  USING (bucket_id = 'contracts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own contract files" ON storage.objects FOR DELETE
  USING (bucket_id = 'contracts' AND auth.uid()::text = (storage.foldername(name))[1]);
