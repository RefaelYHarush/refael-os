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

- **Site URL**: כתובת האתר (production), למשל `https://refael-os.vercel.app`.
- **Redirect URLs**: רשימת הכתובות שאליהן Supabase יכול להפנות אחרי התחברות. חובה להוסיף כאן את השרת המקומי.

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
