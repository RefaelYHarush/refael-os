# חיבור יומן גוגל (Google Calendar) – Refael OS

כן, אפשר לחבר את האתר ליומן של גוגל. יש שתי דרכים עיקריות.

## בקשת גישה ליומן בהתחברות עם גוגל

**כבר מוגדר באפליקציה:** בזמן התחברות עם גוגל, המשתמש יראה ממשק של גוגל שמבקש גם **גישה ליומן (צפייה)**. זה מאפשר אחר כך להשתמש ב-API של יומן גוגל עם הטוקן (`provider_token`) אם תרצה.

כדי שהבקשה תעבוד בלי שגיאות:

1. ב-[Google Cloud Console](https://console.cloud.google.com/apis/library) → בחר את הפרויקט שבו מוגדר ה-OAuth (כמו ב-[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)).
2. חפש **Google Calendar API** ולחץ **Enable**.
3. (אופציונלי) אם האפליקציה במצב "Testing", ייתכן שתצטרך להוסיף משתמשי בדיקה ב-OAuth consent screen.

אם לא מפעילים את Calendar API – ההתחברות עם גוגל תמשיך לעבוד, אבל ה-scope של היומן לא יהיה פעיל.

### שמירת קישור ההטמעה ומיומן נבחר ב-Supabase

כדי שכתובת ההטמעה ובחירת היומן יישמרו בפרופיל (ולא רק במכשיר), הרץ את המיגרציה **פעם אחת** ב-Supabase:

- קובץ: [`docs/SUPABASE_MIGRATION_CALENDAR_PROFILE.sql`](./SUPABASE_MIGRATION_CALENDAR_PROFILE.sql)
- ב-Supabase: **SQL Editor** → הדבק והרץ.

---

## אפשרות 1: הטמעת היומן (Embed) – מומלצת להתחלה

**איך זה עובד:** היומן של גוגל מוצג בתוך האתר באמצעות iframe. אין צורך בהרשאות נוספות או ב-API.

**שלבים:**

1. היכנס ל-[Google Calendar](https://calendar.google.com).
2. בצד שמאל ליד היומן הרצוי → **הגדרות** (גלגל שיניים) → **הגדרות**.
3. בחר את היומן מהרשימה ולחץ עליו.
4. גלול ל-**"אינטגרציה של היומן"** (Integrate calendar).
5. העתק את ה-**"קוד להטמעה"** (Embed code) – זהו קוד `<iframe>`.
6. מתוך הקוד העתק רק את ה-URL שמופיע ב-`src="..."` (מתחיל ב-`https://calendar.google.com/calendar/embed?...`).
7. באפליקציה: עבור לטאב **יומן**, הדבק את הכתובת בשדה "קישור להטמעת יומן" ולחץ שמור.

היומן יוצג בדף היומן באתר. הכתובת נשמרת במכשיר שלך (localStorage).

**יתרונות:** פשוט, בלי הגדרות גוגל קלאוד, בלי OAuth נוסף.  
**חיסרון:** רק צפייה – אי אפשר ליצור אירועים מהאפליקציה.

### הטמעה אוטומטית (מחובר עם גוגל)

אם התחברת עם גוגל ו־Calendar API פעיל, **אין צורך להדביק קישור**. בטאב **יומן** בחר יומן מהרשימה "אירועים מהיומן" – היומן יוצג אוטומטית עם:
- שפה עברית (`hl=iw`)
- אזור זמן לפי המכשיר (`ctz`)
- תצוגת שבוע (`mode=WEEK`)

כפתור **"פתח ביומן גוגל"** פותח את היומן בטאב חדש באתר גוגל.

---

## אפשרות 2: Google Calendar API – אינטגרציה מלאה

**איך זה עובד:** האפליקציה קוראת ל-Google Calendar API עם ההתחברות הקיימת של גוגל (דרך Supabase), אחרי שהוספת scope של יומן.

**מה זה מאפשר:**  
- להציג אירועים מתוך היומן של גוגל באפליקציה.  
- (אופציונלי) ליצור אירועים – למשל להפוך משימות יומיות לאירועים ביומן.

**שלבים (תמצית):**

1. **Google Cloud Console**
   - בפרויקט שבו מוגדר כבר ה-OAuth (כמו ב-[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)):
     - [APIs & Services → Library](https://console.cloud.google.com/apis/library) → חפש **Google Calendar API** → **Enable**.
   - ב-**Credentials** → ה-OAuth 2.0 Client שבו משתמשים ל-Supabase – אין חובה ליצור client חדש.

2. **Scope יומן בהתחברות**
   - באפליקציה כבר מועבר ה-scope `https://www.googleapis.com/auth/calendar.readonly` ב-`signInWithGoogle` (ב-`AuthContext.jsx`). גוגל מציגה את בקשת הגישה ליומן במסך האישור.

3. **שימוש ב-provider token**
   - אחרי שהמשתמש נכנס עם גוגל, Supabase מחזיר ב-session את `provider_token` (access token של גוגל).
   - אפשר לקרוא ל-API של גוגל מהפרונט:
     - `GET https://www.googleapis.com/calendar/v3/users/me/calendarList` – רשימת יומנים.
     - `GET https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events` – אירועים.
   - כותרת: `Authorization: Bearer <provider_token>`.

4. **תשומת לב**
   - ה-`provider_token` מתחלף (expires). אם Supabase מרענן את הסשן עם גוגל, ייתכן שיהיה צורך ב-refresh token או בהתחברות מחדש כדי לקבל token חדש עם scope יומן.
   - מומלץ לבדוק ב-[Supabase Auth – Session](https://supabase.com/docs/reference/javascript/auth-getsession) את המבנה של ה-session (כולל `provider_token` ו-`provider_refresh_token`) בפרויקט שלך.

אם תרצה, אפשר בשלב הבא להוסיף בפרויקט דף/קומפוננטה שקוראת ל-Calendar API עם ה-`provider_token` ומציגה אירועים.

---

## סיכום

| שיטה        | קושי        | מה מקבלים                          |
|-------------|-------------|-------------------------------------|
| **הטמעה**   | קל          | צפייה ביומן בתוך האתר              |
| **Calendar API** | בינוני–מתקדם | צפייה + אפשרות ליצירת אירועים וסנכרון |

להתחלה – מומלץ להשתמש ב**אפשרות 1 (הטמעה)** מהדף "יומן" באפליקציה. אם תרצה אינטגרציה עמוקה יותר (רשימת אירועים, סנכרון משימות), נמשיך לאפשרות 2 עם Calendar API.
