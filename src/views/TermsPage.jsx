import React from 'react';
import { SimplePageLayout } from '../components/layout/SimplePageLayout';

export function TermsPage() {
  return (
    <SimplePageLayout title="תנאי שימוש">
      <p className="mb-4 text-slate-600 dark:text-slate-400 text-sm">
        עדכון אחרון: {new Date().toLocaleDateString('he-IL')}
      </p>
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">1. קבלת התנאים</h2>
        <p className="mb-2">
          השימוש בשירות REFAEL OS (&quot;השירות&quot;) כפוף לתנאי שימוש אלה. גישה לשירות או שימוש בו מהווים הסכמה לתנאים. אם אינך מסכים – אנא אל תשתמש בשירות.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">2. תיאור השירות</h2>
        <p className="mb-2">
          השירות מספק דשבורד אישי לניהול נתונים: יומן מסחר, משימות יומיות, פרויקטים ואבני דרך. הנתונים נשמרים בענן ונגישים רק למשתמש המחובר לחשבונו.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">3. חשבון ואבטחה</h2>
        <p className="mb-2">
          אתה אחראי לשמירה על סודיות פרטי ההתחברות ולכל הפעילות שמתבצעת מחשבונך. יש להודיע לנו מיד על שימוש לא מורשה.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">4. שימוש מותר</h2>
        <p className="mb-2">
          אסור להשתמש בשירות למטרות בלתי חוקיות או בניגוד לתנאים. אסור לנסות לפרוץ, להשבית או להזיק לשירות או לנתוני משתמשים אחרים.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">5. שינויים והפסקת שירות</h2>
        <p className="mb-2">
          אנו רשאים לעדכן את התנאים או את השירות מעת לעת. המשך שימוש לאחר עדכון מהווה הסכמה. אנו רשאים להפסיק או להגביל גישה לשירות בהתאם לשיקול דעתנו.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">6. אחריות</h2>
        <p className="mb-2">
          השירות ניתן &quot;כמות שהוא&quot;. אין לנו אחריות לנזקים עקיפים או לתוצאות שימוש או אי-שימוש בשירות. האחריות על הנתונים שהזנת וקבלת החלטות על בסיסם חלה עליך.
        </p>
      </section>
      <p className="text-slate-500 dark:text-slate-400 text-sm">
        לשאלות בנושא תנאי השימוש ניתן ליצור קשר.
      </p>
    </SimplePageLayout>
  );
}
