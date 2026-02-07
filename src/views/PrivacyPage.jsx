import React from 'react';
import { SimplePageLayout } from '../components/layout/SimplePageLayout';

export function PrivacyPage() {
  return (
    <SimplePageLayout title="מדיניות פרטיות">
      <p className="mb-4 text-slate-600 dark:text-slate-400 text-sm">
        עדכון אחרון: {new Date().toLocaleDateString('he-IL')}
      </p>
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">1. אילו נתונים נאספים</h2>
        <p className="mb-2">
          <strong>נתוני חשבון:</strong> אימייל וסיסמה (מוצפנת) בעת הרשמה. הנתונים מאוחסנים אצל ספק האימות (Supabase) בהתאם לתנאיו.
        </p>
        <p className="mb-2">
          <strong>נתוני שימוש:</strong> הנתונים שאתה מזין באפליקציה – מסחר, משימות, פרויקטים, אבני דרך ו־XP – נשמרים בענן ומשויכים לחשבון שלך בלבד. אין לנו גישה לתוכן הנתונים האישיים שלך.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">2. מטרת השימוש</h2>
        <p className="mb-2">
          הנתונים משמשים להפעלת השירות: הצגת הדשבורד שלך, סנכרון בין מכשירים ושמירה מאובטחת. איננו משתמשים בנתונים האישיים שלך לפרסום או למכירה לצדדים שלישיים.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">3. אחסון ואבטחה</h2>
        <p className="mb-2">
          הנתונים מאוחסנים בענן (Supabase) עם הגבלת גישה לפי משתמש (Row Level Security). התקשורת מתבצעת through חיבורים מוצפנים (HTTPS).
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">4. שיתוף עם צדדים שלישיים</h2>
        <p className="mb-2">
          איננו מוכרים או משתפים את הנתונים האישיים שלך עם צדדים שלישיים למטרות שיווק. ספקי התשתית (אירוח, אימות) מחזיקים בנתונים רק לצורך מתן השירות ובהתאם להסכמים ואכיפת פרטיות.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">5. זכויותיך</h2>
        <p className="mb-2">
          אתה יכול לבקש גישה לתיקון או למחיקת הנתונים שלך. ניתן למחוק את החשבון ואת כל הנתונים המשויכים אליו דרך ההגדרות או על ידי פנייה אלינו.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">6. שינויים</h2>
        <p className="mb-2">
          שינויים במדיניות זו יפורסמו בדף זה עם עדכון התאריך. המשך שימוש בשירות לאחר השינוי מהווה הסכמה לגרסה המעודכנת.
        </p>
      </section>
      <p className="text-slate-500 dark:text-slate-400 text-sm">
        לשאלות בנושא פרטיות: צרו קשר באמצעות הפרטים שמופיעים באתר.
      </p>
    </SimplePageLayout>
  );
}
