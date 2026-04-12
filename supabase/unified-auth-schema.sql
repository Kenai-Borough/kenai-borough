
-- Unified Kenai Network profiles table
-- All 6 sites share this single Supabase project
CREATE TABLE IF NOT EXISTS public.kenai_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  site_roles JSONB NOT NULL DEFAULT '{}'::jsonb,
  city TEXT,
  state TEXT DEFAULT 'AK',
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_docs TEXT[] DEFAULT ARRAY[]::TEXT[],
  last_active_site TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kenai_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.kenai_profiles;
CREATE POLICY "Users can view own profile" ON public.kenai_profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.kenai_profiles;
CREATE POLICY "Users can update own profile" ON public.kenai_profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.kenai_profiles;
CREATE POLICY "Users can insert own profile" ON public.kenai_profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can view all" ON public.kenai_profiles;
CREATE POLICY "Admins can view all" ON public.kenai_profiles FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.kenai_profiles admin_profile,
         jsonb_each_text(COALESCE(admin_profile.site_roles, '{}'::jsonb)) AS admin_roles(site_name, role_name)
    WHERE admin_profile.id = auth.uid() AND admin_roles.role_name = 'admin'
  )
);

CREATE OR REPLACE FUNCTION public.kenai_profiles_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS kenai_profiles_set_updated_at ON public.kenai_profiles;
CREATE TRIGGER kenai_profiles_set_updated_at BEFORE UPDATE ON public.kenai_profiles FOR EACH ROW EXECUTE FUNCTION public.kenai_profiles_set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_kenai_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.kenai_profiles (id, email, full_name, site_roles, last_active_site)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    CASE
      WHEN COALESCE(NEW.raw_user_meta_data->>'site_name', '') <> ''
        THEN jsonb_build_object(NEW.raw_user_meta_data->>'site_name', COALESCE(NEW.raw_user_meta_data->>'site_role', 'visitor'))
      ELSE '{}'::jsonb
    END,
    NEW.raw_user_meta_data->>'site_name'
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.kenai_profiles.full_name),
        site_roles = public.kenai_profiles.site_roles || EXCLUDED.site_roles,
        last_active_site = COALESCE(EXCLUDED.last_active_site, public.kenai_profiles.last_active_site),
        updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_kenai_user();

CREATE OR REPLACE FUNCTION public.update_site_role(user_id UUID, site_name TEXT, role_name TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.kenai_profiles
  SET site_roles = COALESCE(site_roles, '{}'::jsonb) || jsonb_build_object(site_name, role_name),
      last_active_site = site_name,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.delete_kenai_account()
RETURNS VOID AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
