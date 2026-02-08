# חיבור דומיין מותאם – REFAEL OS

כדי שהאתר יעבוד תחת דומיין משלך (למשל `app.refaelos.com` או `refaelos.com`) במקום `refael-os.vercel.app`, יש לעדכן את ההגדרות ב־**Vercel** וב־**Supabase**.

---

## 1. Vercel – הוספת דומיין

1. היכנס ל־[Vercel Dashboard](https://vercel.com/dashboard) ובחר את הפרויקט **refael-os**.
2. **Settings** → **Domains**.
3. הוסף את הדומיין שלך (למשל `app.refaelos.com` או `refaelos.com`).
4. Vercel יציג הוראות **DNS**: להוסיף רשומת CNAME (או A) אצל ספק הדומיין (למשל Cloudflare, Namecheap, GoDaddy) כך שהדומיין יצביע ל־`cname.vercel-dns.com` (או ל־IP שמופיע).
5. אחרי שהדומיין מאומת (יכול לקחת עד 48 שעות), Vercel יפעיל **HTTPS** אוטומטית.

**הערה:** אם אתה משתמש ב־`www.refaelos.com` – הוסף גם את `www` כ־domain נפרד או הגדר redirect מ־`refaelos.com` ל־`www.refaelos.com` (או להפך) בהתאם להעדפה.

---

## 2. Supabase – עדכון Redirect URLs

כדי שהתחברות (OAuth, אימייל, איפוס סיסמה) תעבוד עם הדומיין החדש:

1. היכנס ל־[Supabase Dashboard](https://supabase.com/dashboard) ובחר את הפרויקט.
2. **Authentication** → **URL Configuration**.
3. בשדה **Site URL** – החלף ל־הדומיין החדש, למשל:
   - `https://app.refaelos.com`
   - או `https://refaelos.com`
4. ב־**Redirect URLs** – **הוסף** את כל הכתובות הרלוונטיות, למשל:
   - `https://app.refaelos.com`
   - `https://app.refaelos.com/**`
   - `https://app.refaelos.com/reset-password`
   - (אפשר להשאיר גם את `https://refael-os.vercel.app` לזמן מעבר.)

**חשוב:** אחרי שינוי הדומיין, משתמשים שיפתחו קישור איפוס סיסמה ישן (מ־refael-os.vercel.app) יופנו לשם; קישורים חדשים יישלחו עם הדומיין החדש.

---

## 3. Google Cloud (OAuth) – עדכון Authorized origins ו־Redirect URIs

אם השתמשת ב־Google OAuth (התחברות עם גוגל):

1. היכנס ל־[Google Cloud Console](https://console.cloud.google.com/) ובחר את הפרויקט של Refael OS.
2. **APIs & Services** → **Credentials** → בחר את ה־**OAuth 2.0 Client ID** (Web client).
3. ב־**Authorized JavaScript origins** – הוסף את הדומיין החדש, למשל:
   - `https://app.refaelos.com`
4. ב־**Authorized redirect URIs** – הוסף את ה־redirect URI של Supabase עם הדומיין החדש. לרוב Supabase משתמש ב־:
   - `https://<project-ref>.supabase.co/auth/v1/callback`
   ואם Supabase מוגדר לקבל את הדומיין החדש כ־redirect, אין צורך לשנות כאן – רק לוודא שה־**origins** כולל את הדומיין החדש.

(אם יש לך redirect URI ייעודי לדומיין, הוסף אותו ב־Authorized redirect URIs.)

---

## 4. משתני סביבה (אופציונלי)

אם יש באפליקציה קישורים קשיחים ל־`refael-os.vercel.app` (למשל ב־אימיילים או ב־meta tags), עדכן אותם לדומיין החדש. ב־REFAEL OS ה־meta tags (og:url, og:image וכו') ב־`index.html` משתמשים בכתובת – אם תעבור לדומיין מותאם, עדכן שם את ה־URLs ל־הדומיין החדש (או השתמש במשתנה סביבה ב־build אם תוסיף).

---

## סיכום

| שלב | איפה | מה לעשות |
|-----|------|----------|
| 1 | ספק DNS (דומיין) | CNAME או A record → Vercel |
| 2 | Vercel | Domains → הוסף דומיין, אמת |
| 3 | Supabase | Authentication → URL Configuration → Site URL + Redirect URLs |
| 4 | Google Cloud | Credentials → OAuth client → Authorized origins (ואם צריך Redirect URIs) |
| 5 | index.html / קוד | עדכון URLs לדומיין החדש אם רלוונטי |

אחרי שכל השלבים הושלמו, האתר וההתחברות יעבדו תחת הדומיין המותאם.
