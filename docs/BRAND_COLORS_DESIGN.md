# עיצוב לפי צבעי המותג (Logo.png)

## פלטת צבעים רשמית

| שימוש מומלץ   | צבע        | Hex       |
|---------------|------------|-----------|
| ירוק ראשי (CTA, לינקים, אייקונים) | ליים       | `#a0df50` |
| ירוק כהה (רקע כפתורים, header)   | טיל/יער    | `#013024` |
| שחור         | טקסט, גבולות | `#000000` |
| לבן          | רקע, טקסט על כהה | `#ffffff` |
| אדום/ורוד (משני – שגיאות, הדגשות) | אופציונלי  | `#d45d4a` |

## עקרונות שימוש

1. **מצב בהיר**
   - רקע עמוד: `#fafafa` (--brand-page).
   - טקסט ראשי: שחור או `slate-900`.
   - כפתורי CTA: רקע `#013024`, טקסט לבן.
   - לינקים ואייקוני פעולה: `#a0df50` (--brand-light).

2. **מצב כהה**
   - רקע: גוונים של `#013024` (surface-dark, surface-card).
   - טקסט: `--text-on-dark` / `--text-on-dark-muted`.
   - אקסנט: `#a0df50` לכפתורים משניים, progress, פוקוס.

3. **היררכיה**
   - צבע ראשי אחד (ירוק כהה) לכפתורים ראשיים.
   - ירוק ליים להדגשות, hover, והתקדמות.
   - שחור/לבן לטקסט ורקעים – בלי צבעים אקראיים.

4. **נגישות**
   - ניגוד טקסט על רקע: WCAG AA (כבר מוגדר ב-CSS).
   - טבעת פוקוס: `--brand-light` (#a0df50).

## משתנים ב-CSS (index.css)

כל צבעי המותג מוגדרים ב-`:root` ומשולבים ב-Tailwind ב-`tailwind.config.js`. עדכון עתידי – רק ב-`index.css` ו-`tailwind.config.js`.

## דוגמאות קלאסים (Tailwind)

- כפתור ראשי: `bg-brand-dark text-on-brand` או `text-white`
- כפתור משני: `border-brand-dark text-brand-dark dark:text-brand`
- הדגשה: `text-brand` או `bg-brand/10 text-brand-dark dark:text-brand`
- רקע כרטיס בכהה: `bg-brand-surface-card` או `bg-brand-surface-elevated`
