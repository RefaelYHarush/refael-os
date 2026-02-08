# משימות לפי סדר חשיבות – REFAEL OS

**עודכן:** 8 בפברואר 2026  
**מקור:** דוח חקירה מלא (INVESTIGATION_FULL_2026.md) + TASK_LIST + TASKS_PRIORITY  
**סימון:** ☐ לא בוצע | ☑ בוצע

---

## סדר ביצוע מומלץ (מעלה למטה)

להתחיל מרמה 1, אחר כך 2, ואז 3 לפי זמן וצורך.

---

## רמה 1 – עדיפות גבוהה

| # | משימה | קובץ/מיקום | סטטוס |
|---|--------|-------------|--------|
| **1.1** | **תיעוד: איפוס סיסמה** – לתעד ש־ResetPasswordPage תומך רק ב־hash (לא query params), כפי ש־Supabase שולח. | `docs/` או README / ResetPasswordPage | ☑ |
| **1.2** | **תיעוד: מפתחות אחסון** – לתעד ש־`rafael_os_*` ב־constants הוא legacy; שם הפרויקט refael-os. | `docs/DEVELOPER_NOTES.md`, `constants.js` | ☑ |
| **1.3** | **תיעוד: dev bypass** – לתעד ש־`?dev=1` ב־localhost בלבד, לא לשימוש בפרודקשן. | README + docs/DEVELOPER_NOTES.md | ☑ |

---

## רמה 2 – עדיפות בינונית

| # | משימה | קובץ/מיקום | סטטוס |
|---|--------|-------------|--------|
| **2.1** | **אינדיקציה מתמשכת לסנכרון** – כש־syncError קיים, להציג אייקון קבוע ב־header "ללא סנכרון". | Layout.jsx (CloudOff + תג) | ☑ |
| **2.2** | **כפתור "התחבר" בדף נחיתה** – להבליט: הובר עם צל brand. | LandingView.jsx | ☑ |
| **2.3** | **הודעות שגיאה ספציפיות** – וידוא שהמשתמש רואה טקסט מתאים. | AppContext.jsx – כבר מיושם (מסחר, משימות, וכו') | ☑ |
| **2.4** | **מדיניות סיסמה** – תיעוד ב־PASSWORD_POLICY.md; לוודא ב־Supabase Dashboard. | docs/PASSWORD_POLICY.md + DEVELOPER_NOTES | ☑ |
| **2.5** | **(אופציונלי) Retry אחרי כישלון שמירה** | AppContext – כבר מיושם (withRetry, 3 ניסיונות, השהייה עולה) | ☑ |

---

## רמה 3 – עדיפות נמוכה (שיפור עיצוב/UX)

| # | משימה | קובץ/מיקום | סטטוס |
|---|--------|-------------|--------|
| **3.1** | **Hero בדף נחיתה** – גרדיאנט עדין באזור ה־hero. | LandingView.jsx | ☑ |
| **3.2** | **כרטיסי "מה תקבל"** – hover:-translate-y-0.5 ל־lift. | LandingView.jsx | ☑ |
| **3.3** | **CTA ראשי** – hover:shadow-xl hover:shadow-brand-dark/25. | LandingView.jsx | ☑ |
| **3.4** | **דף Auth** – גרדיאנט עדין ברקע. | AuthView.jsx | ☑ |
| **3.5** | **ספינר / "מתחבר..."** – כבר קיים בטפסים ובכפתור Google. | AuthView.jsx | ☑ |
| **3.6** | **פוקוס על כפתור Google** – focus-visible:ring-2. | AuthView.jsx | ☑ |
| **3.7** | **SEO – og:image** – meta og:image + twitter:image; תיעוד להוספת קובץ. | index.html + docs/DEVELOPER_NOTES.md | ☑ |

---

## מה כבר בוצע (לא ברשימה)

- כפתור התראות – סומן "בקרוב" ו־disabled.
- שגיאות יומן – calendarsError ב־CalendarView, setSyncError ב־saveCalendarProfile.
- כפתור "פרויקט חדש" ב־SaaS – מחובר ל־AddSaasProjectModal.
- פרטי עסקה במסחר – TradeDetailModal מחובר.
- Deep Work Timer – כרטיס פותח DeepWorkTimerModal.
- גרף 7 ימים ריק – הודעה + CTA.
- Open Graph / Twitter בסיסי – קיים ב־index.html.

---

## סיכום

| רמה | בוצע | סה"כ |
|-----|------|------|
| **1** | 3 | 3 |
| **2** | 4 | 5 (2.5 אופציונלי נשאר) |
| **3** | 7 | 7 |

**כל המשימות בוצעו.** Retry כבר היה מיושם ב־AppContext. תמונת שיתוף `public/og-image.png` נוצרה ומוגשת מהאתר.

---

## מה הלאה (אופציונלי)

| שיפור | תיאור |
|--------|--------|
| **Error Boundary** | ☑ נוסף – תופס שגיאות רינדור ומציג "משהו השתבש" + רענן דף. |
| **בדיקות יחידה** | הוספת Vitest או React Testing Library לטסטים על לוגיקה ו־components. |
| **אימות Google** | השלמת אימות האפליקציה ב־Google (סרטון, טופס) – ראה VERIFICATION_STEP_BY_STEP.md. |
| **פיצ'ר התראות** | חיבור כפתור ההתראות (כרגע "בקרוב") – Web Push או אינטגרציה עם יומן. |
| **דומיין מותאם** | חיבור דומיין מותאם ב־Vercel ו־Supabase Redirect URLs. |
