import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export function ProfileModal({ isOpen, onClose }) {
  const { displayName, setDisplayName } = useApp();
  const [value, setValue] = useState(displayName);

  useEffect(() => {
    setValue(displayName);
  }, [displayName, isOpen]);

  const handleSave = () => {
    setDisplayName(value.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" dir="rtl" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="profile-title">
      <div
        className="w-full max-w-sm bg-brand-white dark:bg-brand-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="profile-title" className="text-lg font-bold mb-4">פרופיל</h2>
        <div className="mb-4">
          <label htmlFor="profile-display-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            שם לתצוגה
          </label>
          <input
            id="profile-display-name"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="השם שיופיע בראש הדף"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl bg-brand-dark text-white font-bold hover:opacity-90 transition-opacity"
          >
            שמור
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-600 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ביטול
          </button>
        </div>
        <p className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
          <Link to="/terms" className="hover:text-brand-dark dark:hover:text-brand transition-colors">תנאי שימוש</Link>
          {' · '}
          <Link to="/privacy" className="hover:text-brand-dark dark:hover:text-brand transition-colors">מדיניות פרטיות</Link>
        </p>
      </div>
    </div>
  );
}
