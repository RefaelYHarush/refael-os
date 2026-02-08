# מדיניות סיסמה – Supabase (משימה 3.3.1)

כדי לאכוף אורך ומורכבות סיסמה בפרויקט:

## איפה להגדיר

1. היכנס ל־[Supabase Dashboard](https://supabase.com/dashboard).
2. בחר את הפרויקט **refael-os**.
3. בתפריט: **Authentication** → **Providers** → **Email**.

## מה להגדיר

(לפי [תיעוד Supabase – Password security](https://supabase.com/docs/guides/auth/password-security))

| הגדרה | המלצה |
|--------|--------|
| **Minimum password length** | לפחות **8** תווים (פחות מ־8 לא מומלץ). |
| **Required characters** | מומלץ: **Digits, lowercase, uppercase and symbols** – כך הסיסמה קשה יותר לניחוש. |
| **Leaked password protection** | זמין ב־Pro Plan ומעלה – דוחה סיסמאות שדלפו (HaveIBeenPwned). |

## השפעה על משתמשים קיימים

משתמשים שכבר נרשמו ימשיכו להתחבר עם הסיסמה הנוכחית. אם הסיסמה חלשה מהתקן החדש, ב־`signInWithPassword` הם עלולים לקבל `WeakPasswordError` עם הסבר – אז עדיף להנחות אותם לאיפוס סיסמה חזקה.

## קישור ישיר

- [Auth Providers (Email) – Dashboard](https://supabase.com/dashboard/project/_/auth/providers?provider=Email)  
  (החלף `_` ב־**Project ID** של refael-os אם צריך.)
