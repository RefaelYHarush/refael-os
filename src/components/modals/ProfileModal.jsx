import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ProfileModal({ isOpen, onClose }) {
  const { displayName, setDisplayName, reopenOnboarding } = useApp();
  const [value, setValue] = useState(displayName);

  useEffect(() => {
    setValue(displayName);
  }, [displayName, isOpen]);

  const handleSave = () => {
    setDisplayName(value.trim());
    onClose();
  };

  const handleChangeCategories = () => {
    onClose();
    reopenOnboarding();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/40 backdrop-blur-sm" dir="rtl" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="profile-title">
      <div
        className="w-full max-w-sm bg-brand-white dark:bg-brand-surface-card rounded-card-lg border border-brand-black/8 dark:border-brand/15 shadow-card-dark p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="profile-title" className="text-lg font-bold text-brand-black dark:text-on-brand mb-4">פרופיל</h2>
        <div className="mb-4">
          <label htmlFor="profile-display-name" className="label-brand">שם לתצוגה</label>
          <input
            id="profile-display-name"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="השם שיופיע בראש הדף"
            className="input-brand"
          />
        </div>
        <button
          type="button"
          onClick={handleChangeCategories}
          className="w-full mb-3 py-2.5 rounded-button border border-brand-black/15 dark:border-brand/30 font-bold text-brand-black dark:text-on-brand hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors flex items-center justify-center gap-2"
        >
          <LayoutGrid size={18} aria-hidden />
          שנה קטגוריות בתפריט
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={handleSave} className="flex-1 py-2.5 rounded-button bg-brand-dark text-[var(--text-on-dark)] font-bold hover:opacity-95 transition-opacity">
            שמור
          </button>
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-button border border-brand-black/15 dark:border-brand/25 font-bold text-brand-black/70 dark:text-on-brand-muted hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors">
            ביטול
          </button>
        </div>
        <p className="mt-4 pt-4 border-t border-brand-black/8 dark:border-brand/15 text-center text-xs text-brand-black/55 dark:text-on-brand-muted">
          <Link to="/terms" className="hover:text-brand-dark dark:hover:text-brand transition-colors font-medium">תנאי שימוש</Link>
          {' · '}
          <Link to="/privacy" className="hover:text-brand-dark dark:hover:text-brand transition-colors font-medium">מדיניות פרטיות</Link>
        </p>
      </div>
    </div>
  );
}
