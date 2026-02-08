import React from 'react';
import { Zap, RefreshCw } from 'lucide-react';

/**
 * Error Boundary – תופס שגיאות רינדור ב־React ומציג מסך התאוששות במקום קריסה מלאה.
 * ראה: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (typeof console !== 'undefined' && console.error) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (typeof fallback === 'function') return fallback({ error: this.state.error, reload: this.handleReload });
      if (fallback) return fallback;

      return (
        <div className="min-h-screen bg-brand-page dark:bg-brand-dark flex items-center justify-center p-6" dir="rtl">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-card bg-brand-accent-secondary/10 border border-brand-accent-secondary/30 flex items-center justify-center mx-auto mb-6">
              <Zap className="text-brand-accent-secondary" size={32} aria-hidden />
            </div>
            <h1 className="text-xl font-bold text-brand-black dark:text-on-brand mb-2">משהו השתבש</h1>
            <p className="text-brand-black/65 dark:text-on-brand-muted text-sm mb-6">
              אירעה שגיאה בטעינת הדף. נסה לרענן את הדף או לחזור מאוחר יותר.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-button bg-brand-dark text-[var(--text-on-dark)] font-semibold hover:opacity-95 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <RefreshCw size={18} aria-hidden />
              רענן דף
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
