# אימות האפליקציה – צעד־אחר־צעד (עשה בעצמך ב־5 דקות)

רק **אתה** יכול להגיש מאימת Google – אבל כאן הכל מוכן להעתקה. עשה לפי הסדר.

---

## לפני שמתחילים – צ'קליסט

- [ ] **האתר חי:** נפתח https://refael-os.vercel.app (ודפי /privacy ו־/terms נגישים).
- [ ] **סרטון מוכן:** צילמת 1–2 דקות (נחיתה → התחברות גוגל → דשבורד → יומן), העלית ל־YouTube (Unlisted), ויש לך קישור להדביק.
- [ ] **חשבון גוגל:** נכנס עם החשבון שבו נוצר הפרויקט ב־Google Cloud (למשל refael00111@gmail.com – אם הפרויקט נוצר בחשבון אחר, השתמש באותו חשבון).

אם כל הסימונים מסומנים – עבור לצעד 1.

---

## צעד 1: פתח את המסך

1. היכנס ל־https://console.cloud.google.com/ (עם החשבון refael00111@gmail.com או החשבון שבו יצרת את הפרויקט).
2. **בחר פרויקט** – למעלה לוחצים על "Select a project" ובוחרים את הפרויקט של Refael OS.
3. בתפריט: **APIs & Services** → **OAuth consent screen**.

---

## צעד 2: לפרסם (אם מופיע Testing)

- גלול ל־**Publishing status**.
- אם כתוב **Testing** – לוחצים **PUBLISH APP** ומאשרים.

---

## צעד 3: להתחיל אימות

- על אותו דף: לוחצים **Prepare for verification** או **Verify app** (או **Request verification**).

---

## צעד 4: למלא קישורים (העתק־הדבק)

בטופס שייפתח, בשדות הבאים – **העתק** מהשורה המתאימה **הדבק**:

**Application homepage / דף הבית:**
```
https://refael-os.vercel.app
```

**Privacy policy / מדיניות פרטיות:**
```
https://refael-os.vercel.app/privacy
```

**Terms of service / תנאי שימוש:**
```
https://refael-os.vercel.app/terms
```

---

## צעד 5: הסבר שימוש ב־Scope (העתק־הדבק)

בשדה שמבקש הסבר על השימוש ב־Google Calendar (ולמשימות אם מופיע) – **העתק את כל הבלוק** והדבק:

```
Refael OS is a personal life-management dashboard. We request access to Google Calendar to:
1. Display the user's upcoming events inside the app (read-only).
2. Allow the user to sync their daily to-do tasks from the app to their Google Calendar as all-day events for the current day.

Data is used only on the user's device and in their own calendar. We do not store or share calendar data with third parties. The user can revoke access at any time via their Google account settings.
```

אם יש שדה נפרד ל־Google Tasks, אפשר להדביק:
```
We request access to Google Tasks so the user can view and manage their tasks from our app. Task data is used only for the user's own tasks; we do not share it with third parties.
```

---

## צעד 6: סרטון הדגמה (חובה – רק אתה יכול)

1. צלם מסך (1–2 דקות): פתיחת האתר → "התחבר עם Google" → כניסה → מעבר לטאב "יומן" → מראה שהאירועים מוצגים (ואם רוצה: לחיצה על "סנכרן משימות ליומן").
2. העלה ל־YouTube (אפשר **Unlisted**).
3. בשדה **Demo video** / **Video showing app functionality** הדבק את קישור הסרטון.

**תסריט מפורט וצ'קליסט:** ראה [GOOGLE_VERIFICATION_VIDEO_SCRIPT.md](GOOGLE_VERIFICATION_VIDEO_SCRIPT.md).

---

## צעד 7: לשלוח

- לוחצים **Submit for verification** (או **Send for verification**).
- גוגל תשלח מייל שהבקשה התקבלה. בדיקה בדרך כלל עד 2–3 שבועות.

---

**זהו.** צעדים 1–3 ו־6–7 דורשים פעולה שלך (כניסה לחשבון, בחירת פרויקט, צילום והעלאת סרטון, שליחה). צעדים 4–5 – רק להעתיק מהדף הזה ולהדביק בטופס.  
**קובץ נוח להעתקה:** כל הקישורים והטקסטים להדבקה מרוכזים גם ב־[GOOGLE_VERIFICATION_COPY_PASTE.md](GOOGLE_VERIFICATION_COPY_PASTE.md) – אפשר לפתוח אותו ליד הטופס ולהעתיק משם.

---

**טיפ לצעד 6 (סרטון):** לפני הצילום הרץ `npm run dev` בתיקיית הפרויקט, היכנס עם גוגל, עבור לטאב "יומן" והראה את האירועים (ואפשר גם בחירת תצוגה שבוע/חודש/רשימה ו"פתח ביומן גוגל").
