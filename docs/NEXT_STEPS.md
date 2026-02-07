# מה עכשיו – refael-os

## 1. להריץ את האפליקציה (עכשיו)

```bash
cd refael-os
npm install
npm run dev
```

פותח בדפדפן: http://localhost:5173

---

## 2. Supabase – פרויקט חדש

- **סטטוס:** הפרויקט נוצר ועדיין מתאתחל (COMING_UP). בדרך כלל 1–2 דקות.
- **Dashboard:** https://supabase.com/dashboard/project/ubfebxeqetfxlqkxqwtb
- **API:** `https://ubfebxeqetfxlqkxqwtb.supabase.co`

**כשהפרויקט יהיה ACTIVE_HEALTHY:**
- להיכנס ל-Dashboard → Table Editor → ליצור טבלאות (למשל `trades`, `daily_tasks`, `saas_projects`, `vision_milestones`).
- להעתיק `.env.example` ל-`.env` ולהריץ שוב את האפליקציה.
- (אופציונלי) לעדכן את הקוד ב-`AppContext` / hooks כדי לקרוא/לכתוב מ-Supabase במקום רק מ-localStorage.

---

## 3. פריסה ל-Vercel (אופציונלי)

1. לדחוף את הקוד ל-GitHub.
2. ב־https://vercel.com/dashboard → New Project → לחבר את הריפו.
3. Root Directory: `refael-os` (אם הריפו הוא האבא של refael-os).
4. Build: `npm run build`, Output: `dist`.
5. להוסיף Environment Variables אם יש: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (מהערכים ב-.env.example).

אחרי הדפלוי תקבל קישור כמו: `https://refael-os-xxx.vercel.app`.

---

## סיכום

| צעד              | סטטוס / פעולה |
|------------------|----------------|
| הרצה מקומית      | `npm run dev`  |
| Supabase         | לחכות ל-ACTIVE, אז ליצור טבלאות ולחבר |
| Vercel           | לחבר ריפו ב-Dashboard ולפרוס |
