# REFAEL OS

Life Management System – דשבורד אישי לניהול מסחר, SaaS, משימות יומיות וחזון ארוך טווח.

**עשה לפי סדר חשיבות:** [docs/DO_PRIORITY_ORDER.md](docs/DO_PRIORITY_ORDER.md)

## הרצה

```bash
cd refael-os
npm install
npm run dev
```

פותח בדפדפן: http://localhost:5173

## טכנולוגיות

- React 18 + Vite
- Tailwind CSS (כולל dark mode)
- Lucide React (אייקונים)
- RTL (עברית)

## פיתוח מקומי בלי התחברות

להרצה בלי Supabase: פתח `http://localhost:5173/?dev=1` (רק ב־localhost – לא בפרודקשן).  
פרטים נוספים: [docs/DEVELOPER_NOTES.md](docs/DEVELOPER_NOTES.md).

## בדיקות

לפני הרצת בדיקות יש להריץ `npm install` (כולל vitest ו־testing-library).

```bash
npm install     # חובה פעם אחת – אחרת vitest לא יימצא
npm run test    # מצב צפייה (watch)
npm run test:run  # הרצה חד־פעמית
```
