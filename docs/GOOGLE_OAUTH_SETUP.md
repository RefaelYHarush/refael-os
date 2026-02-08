# הגדרת התחברות עם גוגל – Refael OS

## כתובת ה-Callback להעתקה (להגשה ב-Google Cloud)

```
https://ubfebxeqetfxlqkxqwtb.supabase.co/auth/v1/callback
```

---

## שלב 1: Google Cloud Console

1. היכנס ל־[Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. בחר פרויקט קיים או **Create Project** → תן שם (למשל "Refael OS") → Create.
3. **Create Credentials** → **OAuth client ID**.
4. אם מתבקש – הגדר **OAuth consent screen**:
   - User Type: **External** (או Internal אם זה Workspace).
   - מלא App name (למשל "Refael OS"), Support email → Save and Continue עד הסוף.
5. חזור ל־**Credentials** → **Create Credentials** → **OAuth client ID**.
6. **Application type**: **Web application**.
7. **Name**: למשל `Refael OS Web`.
8. ב־**Authorized redirect URIs** לחץ **Add URI** והדבק:
   ```
   https://ubfebxeqetfxlqkxqwtb.supabase.co/auth/v1/callback
   ```
9. **Create** → העתק את **Client ID** ואת **Client Secret** (תצטרך אותם בשלב 2).

---

## "האפליקציה לא אומתה" / This app isn't verified – איך לפתור

גוגל מציגה הודעה כזו כי האפליקציה במצב **Testing** (לא עברה אימות רשמי של גוגל). יש שתי דרכים:

---

### אפשרות 1: להמשיך בלי אימות (מהיר – מתאים לשימוש אישי או צוות קטן)

**שלב א – להוסיף משתמשי בדיקה (Test users):**

1. היכנס ל־[Google Cloud Console](https://console.cloud.google.com/) ובחר את הפרויקט של Refael OS.
2. בתפריט השמאלי: **APIs & Services** → **OAuth consent screen** (או ישירות: [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)).
3. גלול ל־**Test users**.
4. לחץ **+ ADD USERS** והוסף את **כתובת Gmail שלך** (וכל משתמש נוסף שאמור להתחבר).
5. **Save**.

**שלב ב – להתחבר למרות האזהרה:**

1. באתר לחץ "התחבר עם Google".
2. אם מופיעה המסך **"Google לא אימתה את האפליקציה הזו"** (עם הכפתור "חזרה למצב בטוח" ו"מתקדם"):
   - **אל** תלחץ "חזרה למצב בטוח".
   - לחץ **מתקדם** (הקישור בתחתית).
   - במסך הבא תופיע האפשרות **"עבור ל־[Refael OS] (לא מאובטח)"** – לחץ עליה.
3. אשר גישה – ההתחברות תעבוד.

זה בטוח כי **רק** הכתובות שהוספת כ־Test users יכולות להתחבר.

---

### אפשרות 2: שהמסך לא יופיע בכלל – אימות האפליקציה אצל גוגל

אם תרצה ש**המסך "Google לא אימתה את האפליקציה" לא יופיע** (וגם בלי "מתקדם"), צריך לפרסם את האפליקציה ולשלוח אותה **לאימות (Verification)** אצל גוגל.

**הנחיות מפורטות:** יש מסמך נפרד עם כל השלבים – [**איך לגרום למסך לא להופיע (אימות אפליקציה)**](./GOOGLE_APP_VERIFICATION.md).

**בקצרה:**
1. [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent) → **PUBLISH APP** (העברה ל־Production).
2. **Prepare for verification** / **Submit for verification** – למלא קישורים למדיניות פרטיות ולתנאי שימוש, להעלות סרטון הדגמה, להסביר את השימוש ב־scope (יומן).
3. לשלוח – גוגל בודקים (בדרך כלל עד כמה שבועות). אחרי אישור – המסך לא יופיע יותר.

לאפליקציה אישית/פנימית בדרך כלל מספיק **אפשרות 1** (Test users + "מתקדם" → "עבור ל־...").

---

## אם מופיעה: "The developer hasn't given you access to this app"

**אם ב־Audience מופיע "In production"** – לא צריך להוסיף Test users; נסה שוב "התחבר עם Google". אם עדיין מופיעה "אפליקציה לא מאומתת", המשך דרך **מתקדם** → **עבור ל־[שם האתר] (לא מאובטח)**.

**אם ב־Audience מופיע "Testing"** – רק כתובות שמופיעות כ-**Test users** יכולות להתחבר. הוסף את עצמך (ואת שאר המשתמשים) ב־[OAuth consent screen → Test users](https://console.cloud.google.com/apis/credentials/consent) (פרויקט הנכון) → **+ ADD USERS** → שמור.

**חשוב:** אם אתה משתמש ב־localhost (למשל `http://localhost:5179`), וודא שב־**Supabase → Authentication → URL Configuration** ה־Redirect URLs כולל את ה־localhost שלך.

---

## שלב 2: Supabase – הדבקת Client ID ו-Secret

**אפשרות א – דשבורד (פשוט):**

1. היכנס ל־[Supabase – Google Provider](https://supabase.com/dashboard/project/ubfebxeqetfxlqkxqwtb/auth/providers).
2. ברשימת ה-Providers מצא **Google** ולחץ כדי לפתוח.
3. הפעל **Enable Sign in with Google**.
4. הדבק את **Client ID** ו-**Client Secret** מהשלב הקודם.
5. **Save**.

**אפשרות ב – סקריפט (משורת הפקודה):**

אם יש לך Personal Access Token מ-Supabase:

```bash
cd refael-os
SUPABASE_PAT="הטוקן_שלך" \
  GOOGLE_CLIENT_ID="ה-Client-ID-מגוגל" \
  GOOGLE_CLIENT_SECRET="ה-Client-Secret-מגוגל" \
  ./scripts/enable-google-auth.sh
```

(טוקן: [Supabase → Account → Access Tokens](https://supabase.com/dashboard/account/tokens))

---

## שלב 3: Vercel – משתני סביבה (חובה כדי שהכפתור יופיע)

כדי שכפתור "התחבר עם Google" יוצג באתר ב-Vercel, חייבים להגדיר שם את משתני Supabase:

1. Vercel → הפרויקט **refael-os** → **Settings** → **Environment Variables**
2. הוסף:
   - **Name:** `VITE_SUPABASE_URL` | **Value:** `https://ubfebxeqetfxlqkxqwtb.supabase.co`
   - **Name:** `VITE_SUPABASE_ANON_KEY` | **Value:** (המפתח מ־Supabase → Project Settings → API → anon public)
3. **Redeploy** את האתר (Deployments → ⋮ → Redeploy).

בלי המשתנים האלה האפליקציה לא יודעת שיש Supabase, ולכן הכפתור לא מוצג.

---

## שלב 4: Site URL ו-Redirect URLs

ב־[URL Configuration](https://supabase.com/dashboard/project/ubfebxeqetfxlqkxqwtb/auth/url-configuration):

- **Site URL**: כתובת האתר (production), **בדיוק** כמו שמופיע בדפדפן – בלי סלאש בסוף. למשל `https://refael-os.vercel.app` (לא `https://refael-os.vercel.app/`).
- **Redirect URLs**: רשימת הכתובות שאליהן Supabase יכול להפנות אחרי התחברות. חובה ש-**כתובת השורש של האתר** תהיה ברשימה (אותה כתובת כמו Site URL). חובה גם להוסיף את הכתובת המקומית לפיתוח.

**אם אחרי ההתחברות עם גוגל ההפניה "לא נכונה"** (לא נכנסים לאפליקציה, או נשארים עם כתובת מוזרה): וודא ש־Site URL ו־Redirect URLs תואמים **בדיוק** לכתובת שבה האתר רץ (כולל http vs https, עם או בלי www). אחרי התחברות מוצלחת האפליקציה מנקה אוטומטית את ה־hash מה־URL כדי שהכתובת תוצג יפה.

---

## פיתוח מקומי – התחברות עם גוגל "מבוילת"

אם התחברות עם גוגל עובדת ב-production אבל **לא ב-localhost**, Supabase חוסם הפניה חזרה לשרת המקומי.

**פתרון:** להוסיף את כתובת הלוקל ל-**Redirect URLs** ב-Supabase:

1. פתח [Supabase → URL Configuration](https://supabase.com/dashboard/project/ubfebxeqetfxlqkxqwtb/auth/url-configuration).
2. בשדה **Redirect URLs** הוסף שורה (או וודא שהיא קיימת):
   - `http://localhost:5173`
   - אם Vite רץ על פורט אחר (למשל 5176), הוסף גם: `http://localhost:5176`.
3. **Save**.

אחרי השמירה – נסה שוב "התחבר עם Google" מהשרת המקומי.

---

אחרי שמירה – כפתור "התחבר עם Google" באפליקציה אמור לעבוד.
