-- Run this in Supabase SQL Editor to add tables for Life Domains (health, learning, finance, relationships).
-- Then enable RLS and policies per your existing pattern (e.g. user_id = auth.uid()).

-- Health entries: workout, sleep, water
CREATE TABLE IF NOT EXISTS health_entries (
  id bigint PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  type text NOT NULL CHECK (type IN ('workout', 'sleep', 'water')),
  value numeric NOT NULL DEFAULT 0,
  note text DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_health_entries_user_date ON health_entries(user_id, date DESC);

-- Learning items: courses, books, skills
CREATE TABLE IF NOT EXISTS learning_items (
  id bigint PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'course' CHECK (type IN ('course', 'book', 'skill')),
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('planned', 'in_progress', 'done')),
  progress smallint NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  note text DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_learning_items_user ON learning_items(user_id);

-- Finance goals
CREATE TABLE IF NOT EXISTS finance_goals (
  id bigint PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  target_amount numeric NOT NULL DEFAULT 0,
  current_amount numeric NOT NULL DEFAULT 0,
  deadline text DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_finance_goals_user ON finance_goals(user_id);

-- Relationships: stay in touch
CREATE TABLE IF NOT EXISTS relationships (
  id bigint PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  last_contact date DEFAULT NULL,
  note text DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_relationships_user ON relationships(user_id);

-- RLS (enable and create policy per your project; example: allow user only their rows)
ALTER TABLE health_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own health_entries" ON health_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own learning_items" ON learning_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own finance_goals" ON finance_goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own relationships" ON relationships
  FOR ALL USING (auth.uid() = user_id);
