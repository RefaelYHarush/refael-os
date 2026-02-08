import React, { useState, useRef, useEffect } from 'react';
import { Accessibility, X, Type, Contrast, Link2, Move, RotateCcw } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const FONT_OPTIONS = [
  { value: 1, label: 'רגיל' },
  { value: 1.15, label: 'גדול' },
  { value: 1.25, label: 'גדול מאוד' },
];

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function AccessibilityButton({ className, floating }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        title="נגישות"
        aria-label="הגדרות נגישות"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Accessibility size={floating ? 22 : 20} aria-hidden />
      </button>
      {open && (
        <AccessibilityPanel
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
        />
      )}
    </>
  );
}

/** כפתור צף קבוע לנגישות – תמיד גלוי בפינה */
export function AccessibilityFloatingButton() {
  return (
    <div className="fixed bottom-4 left-4 z-50 safe-area-pb" dir="rtl" aria-hidden="true">
      <AccessibilityButton
        floating
        className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-dark text-white shadow-lg shadow-brand-dark/40 hover:bg-brand-dark/90 hover:scale-105 active:scale-95 transition-transform focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-brand-page dark:focus:ring-offset-brand-dark"
      />
    </div>
  );
}

export function AccessibilityPanel({ onClose }) {
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const {
    fontScale,
    setFontScale,
    highContrast,
    toggleHighContrast,
    highlightLinks,
    toggleHighlightLinks,
    reduceMotion,
    toggleReduceMotion,
    reset,
  } = useAccessibility();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const focusables = [...el.querySelectorAll(FOCUSABLE)].filter((n) => n.tabIndex !== -1);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    el.addEventListener('keydown', handleTab);
    return () => el.removeEventListener('keydown', handleTab);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="הגדרות נגישות"
    >
      <div
        ref={panelRef}
        className="w-full max-w-sm bg-brand-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Accessibility size={20} className="text-brand-dark" aria-hidden />
            נגישות
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="סגור"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Type size={16} aria-hidden />
              גודל טקסט
            </span>
            <div className="flex gap-2">
              {FONT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFontScale(opt.value)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                    fontScale === opt.value
                      ? 'bg-brand-dark text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Contrast size={16} aria-hidden />
              ניגודיות גבוהה
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={highContrast}
              onClick={toggleHighContrast}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                highContrast ? 'bg-brand-dark' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-[left] ${
                  highContrast ? 'left-1' : 'left-6'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Link2 size={16} aria-hidden />
              הדגשת קישורים
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={highlightLinks}
              onClick={toggleHighlightLinks}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                highlightLinks ? 'bg-brand-dark' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-[left] ${
                  highlightLinks ? 'left-1' : 'left-6'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Move size={16} aria-hidden />
              הפחתת תנועה
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={reduceMotion}
              onClick={toggleReduceMotion}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                reduceMotion ? 'bg-brand-dark' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-[left] ${
                  reduceMotion ? 'left-1' : 'left-6'
                }`}
              />
            </button>
          </div>
          <button
            type="button"
            onClick={() => { reset(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600"
          >
            <RotateCcw size={16} aria-hidden />
            איפוס להגדרות ברירת מחדל
          </button>
        </div>
      </div>
    </div>
  );
}
