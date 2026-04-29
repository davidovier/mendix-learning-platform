-- supabase/migrations/20260429000000_add_user_profiles.sql

-- user_profiles: one row per user, created by trigger on auth.users INSERT
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email                     TEXT        NOT NULL,
  is_admin                  BOOLEAN     NOT NULL DEFAULT false,
  capgemini_status          TEXT        CHECK (capgemini_status IN ('pending', 'approved')),
  capgemini_requested_at    TIMESTAMPTZ,
  capgemini_reviewed_at     TIMESTAMPTZ,
  capgemini_reviewed_by     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_profiles_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_capgemini_status
  ON public.user_profiles(capgemini_status);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER helper — runs as DB owner, bypasses RLS.
-- Used inside RLS policies to check if the current user is admin
-- without causing a circular dependency.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.user_profiles WHERE user_id = auth.uid()),
    false
  );
$$;

-- RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can update any profile"
  ON public.user_profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- INSERT and DELETE are intentionally not granted — profile rows are created
-- exclusively by the handle_new_user() trigger. No client path can insert directly.

-- Trigger function — runs as SECURITY DEFINER so it bypasses RLS on INSERT.
-- Stores email (denormalized) so admin dashboard can read it without
-- needing service-role access to auth.users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email ~* '^[^@]+@capgemini\.com$' THEN
    INSERT INTO public.user_profiles (user_id, email, capgemini_status, capgemini_requested_at)
    VALUES (NEW.id, NEW.email, 'pending', NOW());
  ELSE
    INSERT INTO public.user_profiles (user_id, email)
    VALUES (NEW.id, NEW.email);
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
