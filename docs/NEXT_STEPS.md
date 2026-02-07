# מה עכשיו – refael-os

## 1. להריץ את האפליקציה (עכשיו)

```bash
cd refael-os
npm install
npm run dev
```

פותח בדפדפן: http://localhost:5173

---

## 2. Supabase – מחובר + Auth

- **סטטוס:** ACTIVE_HEALTHY. טבלאות + RLS לפי משתמש.
- **Dashboard:** https://supabase.com/dashboard/project/ubfebxeqetfxlqkxqwtb
- **התחברות:** הרשמה/התחברות באימייל וסיסמה. כל משתמש רואה רק את הנתונים שלו.
- אם Supabase דורש אימות אימייל: Authentication → Providers → Email → כבה "Confirm email" להרשמה מיידית.

בהרצה מקומית: להעתיק `.env.example` ל-`.env`. ב-Vercel הוגדרו כבר `VITE_SUPABASE_URL` ו-`VITE_SUPABASE_ANON_KEY`.

---

## 3. Vercel – פרוס ועובד

- **אתר:** https://refael-os.vercel.app  
- **ריפו:** https://github.com/RefaelYHarush/refael-os  
- כל push ל-`main` מעלה דפלוי אוטומטי.

---

## דפים ציבוריים

- **דף נחיתה:** /  
- **אודות:** /about  
- **תנאי שימוש:** /terms  
- **פרטיות:** /privacy  

---

## מה עכשיו (אפשרויות)

| אם אתה רוצה… | מה לעשות |
|---------------|----------|
| **להשתמש באפליקציה** | גלוש ל־https://refael-os.vercel.app, הרשם/התחבר, מלא דשבורד, מסחר, משימות, חזון. |
| **לשתף עם אחרים** | שלח את הקישור – כל אחד יכול להירשם ולקבל דשבורד משלו. |
| **לפתח מקומית** | `cd refael-os` → העתק `.env.example` ל־`.env` → `npm run dev` → http://localhost:5173 |
| **לעדכן את האתר** | `git add .` → `git commit -m "..."` → `git push` (Vercel יעלה גרסה אוטומטית). |
| **לשנות אימות אימייל** | Supabase Dashboard → Authentication → Providers → Email → Confirm email. |
| **להוסיף פיצ'רים** | דומיין מותאם, תשלומים, ועוד. |

---

## פיצ'רים שקיימים עכשיו

- **שכחתי סיסמה** – בדף ההתחברות: "שכחתי סיסמה" → הזנת אימייל → קישור באימייל → דף `/reset-password` להגדרת סיסמה חדשה.  
  ב-Supabase: Authentication → URL Configuration → Redirect URLs → להוסיף `https://refael-os.vercel.app/reset-password` (ולוקל: `http://localhost:5173/reset-password`).
- **פרופיל** – כפתור ההגדרות (גלגל שיניים) ב-Header → "שם לתצוגה" → האות מופיעה בעיגול הפרופיל.
- **ייצוא נתונים** – כפתור הורדה (Download) ב-Header → "ייצוא מסחר (CSV)" או "ייצוא משימות (CSV)" → קובץ CSV להורדה.
