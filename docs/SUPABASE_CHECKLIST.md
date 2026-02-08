# צ'קליסט Supabase – עשה לפי סדר (2.1 + 2.2)

רק **אתה** יכול להיכנס ל־Supabase – אבל כאן כל הקישורים והערכים להעתקה. עשה לפי הסדר.

---

## שלב 2.1 – מדיניות סיסמה

1. **פתח:**  
   [Supabase – refael-os → Auth → Email Provider](https://supabase.com/dashboard/project/ubfebxeqetfxlqkxqwtb/auth/providers?provider=Email)

2. **בדוק/הגדר:**
   - **Minimum password length:** לפחות **8** (או 6 אם אתה רוצה מינימום קל).
   - **Required characters:** (אופציונלי) סמן Digits, lowercase, uppercase, symbols אם אתה רוצה סיסמאות חזקות.

3. **שמור** אם שינית משהו.

---

## שלב 2.2 – Redirect URLs (איפוס סיסמה)

1. **פתח:**  
   [Supabase – refael-os → Auth → URL Configuration](https://supabase.com/dashboard/project/ubfebxeqetfxlqkxqwtb/auth/url-configuration)

2. **Site URL** – וודא שמופיע:
   ```
   https://refael-os.vercel.app
   ```

3. **Redirect URLs** – וודא שהשורות הבאות **קיימות** (הוסף אם חסר):
   ```
   https://refael-os.vercel.app
   https://refael-os.vercel.app/**
   https://refael-os.vercel.app/reset-password
   ```
   אם אתה מפתח מקומית, הוסף גם:
   ```
   http://localhost:5173
   http://localhost:5173/reset-password
   ```
   (החלף 5173 בפורט ש־Vite מציג אם שונה.)

4. **שמור** אם הוספת משהו.

---

## סיום

אחרי 2.1 ו־2.2 – סמן ב־[DO_PRIORITY_ORDER.md](DO_PRIORITY_ORDER.md) את 2.1 ו־2.2 כ־☑.
