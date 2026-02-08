# הערות למפתחים – REFAEL OS

מסמך תיעוד טכני לפרויקט. עודכן: פברואר 2026.

---

## 1. איפוס סיסמה (Reset Password)

- **דף:** `ResetPasswordPage.jsx`, נתיב `/reset-password`.
- **התנהגות:** הדף בודק אם המשתמש הגיע מקישור איפוס על ידי זיהוי `type=recovery` ב־**hash** או ב־**query string** של ה־URL.
- **Supabase:** Supabase שולח קישור איפוס עם פרמטרים ב־**hash** (fragment). אם בעתיד יגיע קישור עם query params בלבד, הדף תומך גם בזה (`search.includes('type=recovery')`).
- **תוקף:** קישור האיפוס תקף לפי הגדרות Supabase (ברירת מחדל כ־24 שעות). "הקישור לא תקף או שפג תוקפו" מוצג כשהמשתמש נכנס בלי hash/params תקין.

---

## 2. מפתחות אחסון (Storage Keys)

- **קובץ:** `src/data/constants.js` – אובייקט `STORAGE_KEYS`.
- **שם הפרויקט:** הפרויקט נקרא **refael-os** (ספריית הקוד, package.json, Vercel).
- **מפתחות localStorage:** נשארו בפורמט **rafael_os_*** (עם א') מטעמי תאימות לאחור עם נתונים שכבר נשמרו אצל משתמשים.
- **אין לשנות** את המפתחות בלי migration מפורש – אחרת משתמשים קיימים יאבדו גישה לנתונים המקומיים.

---

## 3. Dev Bypass (פיתוח מקומי)

- **מטרה:** לאפשר עבודה על האפליקציה בלי Supabase (או בלי התחברות) בסביבת פיתוח.
- **איך:** הוספת `?dev=1` ל־URL **רק** כאשר הרצה על `localhost` או `127.0.0.1`. לדוגמה: `http://localhost:5173/?dev=1`.
- **התנהגות:** במצב זה האפליקציה מתעלמת מאימות – המשתמש נחשב "מחובר" עם `userId: 'dev-bypass'` וכל הנתונים נשמרים מקומית (localStorage) בלבד.
- **אזהרה:** **אסור** להשתמש ב־`?dev=1` בפרודקשן. הלוגיקה ב־`App.jsx` בודקת `hostname === 'localhost' || hostname === '127.0.0.1'` – בכתובת פרודקשן (למשל refael-os.vercel.app) הפרמטר מתעלם.

---

## 4. מדיניות סיסמה

להגדרת אורך ומורכבות סיסמה ב־Supabase: ראה [PASSWORD_POLICY.md](PASSWORD_POLICY.md). מומלץ לוודא ב־Dashboard את ההגדרות (Authentication → Providers → Email).

---

## 5. Error Boundary

קומפוננטת `ErrorBoundary` (ב־`src/components/ErrorBoundary.jsx`) עוטפת את האפליקציה ב־`main.jsx`. כשקומפוננטה זורקת שגיאה בזמן רינדור, המשתמש רואה מסך "משהו השתבש" עם כפתור "רענן דף" במקום מסך לבן. אפשר להעביר `fallback` כ־prop למסך מותאם.

---

## 6. תמונת שיתוף (SEO)

קובץ `public/og-image.png` (1200×630) משמש כ־`og:image` ו־`twitter:image` לשיתוף ברשתות. הקובץ קיים בפרויקט; ניתן להחליפו בתמונת מותג מעודכנת לפי הצורך.
