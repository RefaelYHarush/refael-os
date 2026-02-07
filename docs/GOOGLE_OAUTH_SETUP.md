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

## שלב 3: Site URL (אם צריך)

ב־[URL Configuration](https://supabase.com/dashboard/project/ubfebxeqetfxlqkxqwtb/auth/url-configuration):

- **Site URL**: כתובת האתר (production), למשל `https://refael-os.vercel.app`.
- לפיתוח מקומי אפשר להוסיף ב-**Redirect URLs**: `http://localhost:5173`.

---

אחרי שמירה – כפתור "התחבר עם Google" באפליקציה אמור לעבוד.
