-- Create profiles table to store user emails
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read profiles
CREATE POLICY \
Anyone
can
read
profiles\ ON public.profiles FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY \Users
can
insert
own
profile\ ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY \Users
can
update
own
profile\ ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS \$\$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users
INSERT INTO public.profiles (id, email)
SELECT id, email FROM auth.users
WHERE email IS NOT NULL
ON CONFLICT (id) DO NOTHING;
