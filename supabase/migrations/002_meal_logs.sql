-- =============================================
-- Phase 2: meal_logs
-- =============================================

CREATE TABLE meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  meal_slot TEXT NOT NULL CHECK (meal_slot IN (
    'breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'extra'
  )),
  name TEXT NOT NULL,
  calories_kcal INTEGER,
  protein_g NUMERIC(5,1),
  carbs_g NUMERIC(5,1),
  fat_g NUMERIC(5,1),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meal_logs_user_date ON meal_logs (user_id, logged_at);

ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meal logs"
  ON meal_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal logs"
  ON meal_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal logs"
  ON meal_logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update own meal logs"
  ON meal_logs FOR UPDATE USING (auth.uid() = user_id);
