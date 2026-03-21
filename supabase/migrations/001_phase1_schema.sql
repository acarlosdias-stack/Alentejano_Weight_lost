-- ============================================
-- Phase 1: profiles, pens, doses, weight_logs
-- ============================================

-- Trigger function: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function: sync weight to profile
CREATE OR REPLACE FUNCTION sync_profile_weight()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET current_weight_kg = NEW.weight_kg WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  height_cm DECIMAL(5,1),
  current_weight_kg DECIMAL(5,1),
  goal_weight_kg DECIMAL(5,1),
  daily_calories_target INTEGER,
  daily_protein_target_g INTEGER,
  daily_carbs_target_g INTEGER,
  daily_fats_target_g INTEGER,
  daily_water_target_ml INTEGER DEFAULT 2500,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Pens
CREATE TABLE pens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  total_mg DECIMAL(6,1) NOT NULL,
  remaining_mg DECIMAL(6,1) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'depleted')),
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doses
CREATE TABLE doses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pen_id UUID REFERENCES pens(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT DEFAULT 'dose' CHECK (type IN ('initialization', 'dose')),
  dose_mg DECIMAL(5,1) NOT NULL,
  taken_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weight logs
CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  weight_kg DECIMAL(5,1) NOT NULL,
  body_fat_pct DECIMAL(4,1),
  bmi DECIMAL(4,1),
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'scale_scan')),
  photo_url TEXT,
  logged_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER sync_weight_to_profile
  AFTER INSERT ON weight_logs
  FOR EACH ROW EXECUTE FUNCTION sync_profile_weight();

-- Indexes
CREATE INDEX idx_doses_user_date ON doses (user_id, taken_at);
CREATE INDEX idx_pens_user_status ON pens (user_id, status);
CREATE INDEX idx_weight_logs_user_date ON weight_logs (user_id, logged_at);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pens ENABLE ROW LEVEL SECURITY;
ALTER TABLE doses ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/write their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Pens: users can CRUD their own
CREATE POLICY "Users can view own pens" ON pens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pens" ON pens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pens" ON pens FOR UPDATE USING (auth.uid() = user_id);

-- Doses: users can CRUD their own
CREATE POLICY "Users can view own doses" ON doses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own doses" ON doses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Weight logs: users can CRUD their own
CREATE POLICY "Users can view own weight logs" ON weight_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weight logs" ON weight_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage buckets (run in Supabase dashboard or via supabase CLI)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('scale-photos', 'scale-photos', false);

-- Storage RLS policies for avatars bucket (public read, authenticated write own)
-- INSERT INTO storage.policies (name, bucket_id, operation, definition)
-- VALUES
--   ('Public read avatars', 'avatars', 'SELECT', 'true'),
--   ('Auth upload own avatar', 'avatars', 'INSERT', 'auth.uid()::text = (storage.foldername(name))[1]'),
--   ('Auth update own avatar', 'avatars', 'UPDATE', 'auth.uid()::text = (storage.foldername(name))[1]');

-- Storage RLS policies for scale-photos bucket (private, owner only)
-- INSERT INTO storage.policies (name, bucket_id, operation, definition)
-- VALUES
--   ('Owner read scale photos', 'scale-photos', 'SELECT', 'auth.uid()::text = (storage.foldername(name))[1]'),
--   ('Owner upload scale photos', 'scale-photos', 'INSERT', 'auth.uid()::text = (storage.foldername(name))[1]');
