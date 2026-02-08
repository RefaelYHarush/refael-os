# וידוא Supabase – REFAEL OS (בוצע)

תאריך: פברואר 2026  
פרויקט: **refael-os** (`ubfebxeqetfxlqkxqwtb`)

---

## 1. RLS (Row Level Security) – מאומת

כל הטבלאות הרלוונטיות מוגנות ב־RLS עם policy שמגביל גישה ל־`auth.uid()` (או `auth.uid()::text` עבור עמודות `user_id` מסוג text).

| טבלה | RLS | Policy |
|------|-----|--------|
| trades | ✅ | Users own trades |
| saas_projects | ✅ | Users own saas_projects |
| vision_milestones | ✅ | Users own vision_milestones |
| daily_tasks | ✅ | Users own daily_tasks |
| user_profile | ✅ | Users own user_profile |
| health_entries | ✅ | Users can CRUD own health_entries |
| learning_items | ✅ | Users can CRUD own learning_items |
| finance_goals | ✅ | Users can CRUD own finance_goals |
| relationships | ✅ | Users can CRUD own relationships |

**מסקנה:** א1.2 ב־SUGGESTED_TASKS_2026 – בוצע. אין צורך בפעולה נוספת.

---

## 2. Redirect URLs (א1.3) – לוודא ידנית

הגדרות ה־Redirect URLs נמצאות ב־**Supabase Dashboard** ולא ניתנות לבדיקה אוטומטית מכאן.

**מה לעשות:**
1. היכנס ל־[Supabase Dashboard](https://supabase.com/dashboard) → פרויקט **refael-os**.
2. **Authentication** → **URL Configuration**.
3. ב־**Redirect URLs** וודא שרשומים **רק**:
   - `https://refael-os.vercel.app/**`
   - `http://localhost:5173/**`  
   (או דומיין מותאם אם החלפת.)
4. אם מופיעים דומיינים לא מוכרים – מחק אותם.

---

## 3. אבטחה – המלצה אופציונלית

יועץ האבטחה של Supabase ממליץ להפעיל **Leaked Password Protection** (בדיקה מול HaveIBeenPwned).

- **איפה:** Dashboard → **Authentication** → **Providers** → **Email** (או בהגדרות Auth).
- **קישור:** [Password strength and leaked password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

---

*מסמך זה נוצר לאחר בדיקה אוטומטית של RLS; Redirect URLs דורשים וידוא ידני בדשבורד.*
