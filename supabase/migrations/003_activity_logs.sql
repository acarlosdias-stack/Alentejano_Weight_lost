-- supabase/migrations/003_activity_logs.sql

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('workout', 'treadmill')),

  -- Workout-specific
  workout_type TEXT CHECK (workout_type IN ('strength', 'cardio', 'hiit', 'yoga', 'other')),
  custom_type_name TEXT,

  -- Shared
  duration_min INTEGER NOT NULL,
  calories_kcal INTEGER,

  -- Treadmill-specific
  speed_kmh DECIMAL(4,1),
  incline_pct DECIMAL(4,1),
  distance_km DECIMAL(5,2),

  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT custom_name_required_for_other
    CHECK (workout_type != 'other' OR custom_type_name IS NOT NULL),
  CONSTRAINT treadmill_has_no_workout_type
    CHECK (type != 'treadmill' OR workout_type IS NULL)
);

CREATE INDEX idx_activity_logs_user_date ON activity_logs (user_id, logged_at DESC);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity logs"
  ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity logs"
  ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activity logs"
  ON activity_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own activity logs"
  ON activity_logs FOR DELETE USING (auth.uid() = user_id);
