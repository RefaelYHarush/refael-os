-- RLS – הפעלה לכל הטבלאות לפי משתמש
-- הרץ ב-Supabase: SQL Editor (פעם אחת).
-- אם טבלה לא קיימת או RLS כבר מופעל – יתכן שתקבל שגיאה; דלג על השורה או הרץ טבלה-טבלה.

-- טבלאות ליבה
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own trades" ON trades FOR ALL USING (auth.uid() = user_id);

ALTER TABLE saas_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own saas_projects" ON saas_projects FOR ALL USING (auth.uid() = user_id);

ALTER TABLE vision_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own vision_milestones" ON vision_milestones FOR ALL USING (auth.uid() = user_id);

ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own daily_tasks" ON daily_tasks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own user_profile" ON user_profile FOR ALL USING (auth.uid() = user_id);

-- Life Domains (רק אם הטבלאות קיימות)
ALTER TABLE health_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own health_entries" ON health_entries FOR ALL USING (auth.uid() = user_id);

ALTER TABLE learning_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own learning_items" ON learning_items FOR ALL USING (auth.uid() = user_id);

ALTER TABLE finance_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own finance_goals" ON finance_goals FOR ALL USING (auth.uid() = user_id);

ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own relationships" ON relationships FOR ALL USING (auth.uid() = user_id);
