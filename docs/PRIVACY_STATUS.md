# מצב פרטיות – REFAEL OS

## סיכום

- **בין משתמשים:** יש הפרדה מלאה. כל הנתונים משויכים ל־`user_id` (מזהה מהתחברות Supabase).
- **באפליקציה:** כל השאילתות ב־`supabaseSync.js` מסננות לפי `userId` – נטענים ונשמרים רק נתונים של המשתמש המחובר.
- **במסד הנתונים:** אמור להיות מופעל **Row Level Security (RLS)** על כל הטבלאות שמכילות נתוני משתמש, כך שגם ברמת ה-DB משתמש רואה רק שורות שבהן `user_id = auth.uid()`.

דף **מדיניות פרטיות** (`/privacy`) מתאר את זה במפורש.

---

## טבלאות שצריכות RLS

| טבלה | עמודת משתמש | הערות |
|------|-------------|--------|
| `trades` | `user_id` | מסחר |
| `saas_projects` | `user_id` | פרויקטים |
| `vision_milestones` | `user_id` | אבני דרך |
| `daily_tasks` | `user_id` | משימות יומיות |
| `user_profile` | `user_id` | פרופיל, XP, יומן |
| `health_entries` | `user_id` | בריאות (אם הטבלה קיימת) |
| `learning_items` | `user_id` | למידה |
| `finance_goals` | `user_id` | יעדים פיננסיים |
| `relationships` | `user_id` | קשרים |

---

## בדיקה ב-Supabase

1. **Supabase Dashboard** → הפרויקט → **Table Editor** (או **SQL Editor**).
2. לכל טבלה מהרשימה: **Authentication** → **Policies** (או דרך SQL) – לוודא ש־RLS **מופעל** ויש policy שמגבילה גישה ל־`auth.uid() = user_id`.

### הפעלת RLS (אם חסר)

אם טבלה עדיין לא מוגנת, הרץ ב־**SQL Editor** (החלף `TABLE_NAME` ו־`user_id` לפי הטבלה):

```sql
ALTER TABLE TABLE_NAME ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own rows" ON TABLE_NAME
  FOR ALL USING (auth.uid() = user_id);
```

דוגמה לטבלאות הראשיות (הרץ רק על טבלאות שקיימות אצלך):

```sql
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
```

לטבלאות Life Domains (בריאות, למידה, כסף, קשרים) יש סקריפט מלא ב־`SUPABASE_MIGRATION_LIFE_DOMAINS.sql`.

**סקריפט אחד לכל הטבלאות:** `docs/SUPABASE_RLS_ENABLE_ALL.sql` – להעתיק ל-Supabase SQL Editor ולהריץ.

---

## רשימת בדיקה

- [ ] RLS מופעל על `trades`
- [ ] RLS מופעל על `saas_projects`
- [ ] RLS מופעל על `vision_milestones`
- [ ] RLS מופעל על `daily_tasks`
- [ ] RLS מופעל על `user_profile`
- [ ] RLS מופעל על טבלאות Life Domains (אם קיימות): `health_entries`, `learning_items`, `finance_goals`, `relationships`
- [ ] מדיניות הפרטיות מעודכנת בדף `/privacy` (כבר מעודכן נכון לכתוב זה)

---

## קישורים

- מדיניות פרטיות באפליקציה: `/privacy`
- קובץ: `src/views/PrivacyPage.jsx`
- סנכרון לפי משתמש: `src/lib/supabaseSync.js`
