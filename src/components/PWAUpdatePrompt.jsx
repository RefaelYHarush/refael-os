import React, { useState, useEffect } from 'react';

export function PWAUpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [reload, setReload] = useState(null);

  useEffect(() => {
    let mounted = true;
    import('virtual:pwa-register')
      .then(({ registerSW }) => {
        const updateSW = registerSW({
          onNeedRefresh: () => { if (mounted) setNeedRefresh(true); },
          onOfflineReady: () => { if (mounted) setOfflineReady(true); },
        });
        setReload(() => updateSW);
      })
      .catch((err) => { console.warn('PWA registration failed', err); });
    return () => { mounted = false; };
  }, []);

  const handleReload = () => reload?.(true);

  if (!needRefresh) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] p-4 bg-brand-dark text-on-brand shadow-lg border-t border-brand/30 safe-area-pb"
      role="alert"
      aria-live="polite"
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm font-medium">גרסה חדשה זמינה</span>
        <button
          type="button"
          onClick={handleReload}
          className="px-4 py-2 rounded-button bg-brand text-brand-dark font-bold text-sm hover:opacity-90 transition-opacity min-h-[44px] touch-manipulation"
        >
          רענן
        </button>
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="px-3 py-2 rounded-button border border-brand/50 text-on-brand-muted text-sm hover:bg-brand/10 min-h-[44px] touch-manipulation"
        >
          אחר כך
        </button>
      </div>
    </div>
  );
}
