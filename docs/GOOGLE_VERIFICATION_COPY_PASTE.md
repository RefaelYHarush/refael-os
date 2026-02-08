# תוכן להעתקה להגשת אימות גוגל

הקובץ הזה מכין לך את כל מה שצריך **להדביק** בטופס האימות של גוגל. את ההגשה עצמה צריך לעשות **אתה** מהחשבון שלך ב־Google Cloud.

---

## קישורים להדביק (החלף את הדומיין אם האתר שלך בכתובת אחרת)

| שדה בטופס גוגל | ערך להדביק |
|-----------------|------------|
| **Application homepage** / דף הבית | `https://refael-os.vercel.app` |
| **Application privacy policy** / מדיניות פרטיות | `https://refael-os.vercel.app/privacy` |
| **Application terms of service** / תנאי שימוש | `https://refael-os.vercel.app/terms` |

---

## הסבר שימוש ב־Scope (להדביק בשדה ההצדקה)

גוגל מבקשת הסבר **באנגלית** למה האפליקציה צריכה גישה ליומן (ולמשימות אם מופיע). אפשר להדביק את הטקסט הזה:

**לגבי Google Calendar (יומן):**

```
Refael OS is a personal life-management dashboard. We request access to Google Calendar to:
1. Display the user's upcoming events inside the app (read-only).
2. Allow the user to sync their daily to-do tasks from the app to their Google Calendar as all-day events for the current day.

Data is used only on the user's device and in their own calendar. We do not store or share calendar data with third parties. The user can revoke access at any time via their Google account settings.
```

**אם יש גם Google Tasks (משימות) – אפשר להוסיף:**

```
We also request access to Google Tasks so the user can view and manage their tasks from our app. Task data is used only to display and update the user's own tasks; we do not share it with third parties.
```

---

## מה להראות בסרטון ההדגמה (Demo video)

גוגל מבקשת סרטון קצר (1–2 דקות). מומלץ לכלול:

1. **מסך הבית / דף הנחיתה** של Refael OS.
2. **לחיצה על "התחבר עם Google"** והמשך עד כניסה.
3. **טאב "יומן"** – איך האירועים מה־Google Calendar מוצגים.
4. (אופציונלי) **סנכרון משימות** – לחיצה על "סנכרן משימות יומיות ליומן" והצגה שה־events נוצרים ביומן הגוגל.

העלה את הסרטון ל־YouTube (אפשר "Unlisted") והדבק את הקישור בשדה שמבקש **Demo video** / **Video showing app functionality**.

---

## איפה מגישים

1. [Google Cloud Console – OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent) (בחר את פרויקט Refael OS).
2. גלול ל־**Publishing status** → **PUBLISH APP** (אם עדיין Testing).
3. לחץ **Prepare for verification** / **Verify app**.
4. מלא את השדות עם הקישורים והטקסט למעלה, העלה את קישור הסרטון → **Submit for verification**.

אחרי שליחה – גוגל בודקים (בדרך כלל עד 2–3 שבועות). אי אפשר לאמת את האפליקציה "במקומך"; רק אתה יכול להגיש מהחשבון שלך.
