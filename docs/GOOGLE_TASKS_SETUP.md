# חיבור משימות גוגל (Google Tasks) – Refael OS

האתר יכול לבקש גישה למשימות גוגל (Google Tasks). אחרי שהמשתמש נותן הרשאה, האתר מציג ומנהל את המשימות ישירות מהדשבורד.

---

## איך זה עובד

1. **התחברות עם גוגל** – כשהמשתמש מתחבר עם Google (או לוחץ "חבר גישה למשימות גוגל"), האתר מבקש גם את ה-scope של משימות: `https://www.googleapis.com/auth/tasks`.
2. **טוקן** – Supabase מחזיר ב-session את `provider_token` (access token של גוגל) שכולל גישה ל-Tasks.
3. **ממשק בדשבורד** – בכרטיס "משימות גוגל" מוצגות רשימות המשימות, אפשר להוסיף משימות, לסמן כהושלמו ולמחוק.

---

## הגדרות נדרשות

### 1. הפעלת Google Tasks API

1. היכנס ל-[Google Cloud Console](https://console.cloud.google.com/apis/library).
2. בחר את אותו הפרויקט שבו מוגדר ה-OAuth (כמו ב-[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)).
3. חפש **Google Tasks API** → **Enable**.

### 2. הוספת Scope ב-OAuth Consent Screen

1. ב-[APIs & Services → OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent).
2. אם יש "Edit app" – ערוך את האפליקציה.
3. ב-**Scopes** (או "Data access") וודא שיש גישה ל־**Google Tasks API** (scope: `https://www.googleapis.com/auth/tasks`). אם צריך, הוסף scope זה.
4. שמור.

### 3. Scope בקוד

האפליקציה כבר מבקשת את ה-scope בהתחברות Google כאשר המשתמש לוחץ "חבר גישה למשימות גוגל" (או מתחבר עם Google כשמופעל בקשת ה-scope). ה-scope מועבר ב-`signInWithOAuth` ב-`options.scopes`.

אם התחברת בעבר עם גוגל **בלי** scope של משימות, ייתכן שתצטרך להתחבר שוב (או ללחוץ "חבר גישה למשימות גוגל") כדי שגוגל יבקש את ההרשאה מחדש.

---

## שימוש באתר

- **בלי גישה** – בדשבורד יוצג כרטיס "משימות גוגל" עם כפתור "חבר גישה למשימות גוגל". לחיצה תפנה להתחברות גוגל עם בקשת הרשאה למשימות.
- **עם גישה** – יוצגו רשימות המשימות (Task Lists), בחירת רשימה, רשימת משימות עם סימון הושלם/לא הושלם, הוספת משימה ומחיקה.

---

## סיכום

| שלב | פעולה |
|-----|--------|
| Google Cloud | הפעלת **Google Tasks API** בפרויקט |
| OAuth Consent | וידוא ש-scope של Tasks מופיע ב־Data access / Scopes |
| אתר | התחברות עם Google (או "חבר גישה למשימות גוגל") → צפייה וניהול משימות בדשבורד |
