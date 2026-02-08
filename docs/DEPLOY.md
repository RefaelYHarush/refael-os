# פריסה (Deploy) – REFAEL OS

## Vercel

1. **חיבור ריפו:** ב־[vercel.com](https://vercel.com) ייבא את הפרויקט מ־Git (או `vercel` מ־CLI).
2. **Root Directory:** אם הפרויקט בתוך תיקייה (למשל `refael-os`), הגדר **Root Directory** ל־`refael-os`.
3. **משתני סביבה:** בהגדרות הפרויקט הוסף:
   - `VITE_SUPABASE_URL` – ה-URL של הפרויקט ב-Supabase
   - `VITE_SUPABASE_ANON_KEY` – מפתח ה-anon (פומבי) מ-Supabase  
   ערכים לדוגמה ב־`.env.example` בתיקיית הפרויקט.
4. **Build:** Vercel ישתמש ב־`npm run build` ו־`dist` אוטומטית (מוגדר ב־`vercel.json`).
5. **דומיין:** אחרי הפריסה אפשר לחבר דומיין מותאם בהגדרות.

## בדיקה מקומית לפני פריסה

```bash
npm run build
npx vite preview
```

נפתח ב־http://localhost:4173 – לוודא שהאפליקציה עובדת כמו ב־dev.
