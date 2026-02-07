import React from 'react';
import { SimplePageLayout } from '../components/layout/SimplePageLayout';

export function AboutPage() {
  return (
    <SimplePageLayout title="אודות">
      <p className="mb-4">
        <strong>REFAEL OS</strong> הוא דשבורד אישי לניהול חיים – מסחר, משימות יומיות, פרויקטים וחזון ארוך טווח.
      </p>
      <p className="mb-4">
        האפליקציה נוצרה כדי לתת לכל משתמש מקום אחד לניהול היומי: יומן מסחר עם PnL ומצב רוח, משימות עם נקודות XP, מעקב אחר פרויקטי SaaS, ואבני דרך לשנים הקרובות. הנתונים נשמרים בענן בצורה מאובטחת ונפרדת לכל משתמש.
      </p>
      <p className="mb-4">
        כרגע השירות ניתן בחינם. ניתן להירשם עם אימייל וסיסמה ולקבל דשבורד משלכם מיד.
      </p>
      <p className="text-slate-500 dark:text-slate-400 text-sm">
        יש שאלות או הצעות? צרו קשר דרך הדרכים שמופיעות באתר.
      </p>
    </SimplePageLayout>
  );
}
