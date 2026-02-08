import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar as CalendarIcon,
  ExternalLink,
  Save,
  Info,
  RefreshCw,
  Clock,
  MapPin,
  AlertCircle,
  CalendarDays,
  Upload,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  fetchCalendarEvents,
  fetchCalendarList,
  createCalendarEvent,
  hasGoogleCalendarAccess,
} from '../lib/googleCalendar';

const STORAGE_KEY = 'refael-os-calendar-embed-url';

function formatEventTime(start, isAllDay) {
  if (!start) return '';
  if (isAllDay) {
    const d = new Date(start);
    return d.toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  const d = new Date(start);
  return d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

function formatEventDate(start) {
  if (!start) return '';
  const d = new Date(start);
  return d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function CalendarView() {
  const { session } = useAuth();
  const {
    calendarEmbedUrl,
    setCalendarEmbedUrl,
    selectedCalendarId,
    setSelectedCalendarId,
    dailyTasks,
  } = useApp();

  const [embedUrl, setEmbedUrl] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const canUseApi = hasGoogleCalendarAccess(session);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState(null);

  const [calendars, setCalendars] = useState([]);
  const [calendarsLoading, setCalendarsLoading] = useState(false);
  const [calendarsError, setCalendarsError] = useState(null);

  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const savedUrl = calendarEmbedUrl || '';

  const loadCalendars = useCallback(async () => {
    if (!canUseApi || !session?.provider_token) return;
    setCalendarsLoading(true);
    setCalendarsError(null);
    const { calendars: list, error } = await fetchCalendarList(session.provider_token);
    setCalendarsLoading(false);
    if (error) setCalendarsError(error);
    else setCalendars(list);
  }, [canUseApi, session?.provider_token]);

  const loadEvents = useCallback(async () => {
    if (!canUseApi || !session?.provider_token) return;
    setEventsLoading(true);
    setEventsError(null);
    const { events: list, error } = await fetchCalendarEvents(session.provider_token, {
      calendarId: selectedCalendarId,
    });
    setEventsLoading(false);
    if (error) setEventsError(error);
    else setEvents(list);
  }, [canUseApi, session?.provider_token, selectedCalendarId]);

  useEffect(() => {
    if (canUseApi) loadEvents();
  }, [canUseApi, loadEvents]);

  useEffect(() => {
    if (canUseApi) loadCalendars();
  }, [canUseApi, loadCalendars]);

  useEffect(() => {
    if (savedUrl) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCalendarEmbedUrl(stored);
    } catch (_) {}
  }, []);

  const handleSave = () => {
    const url = embedUrl.trim();
    if (!url) return;
    const src = url.includes('src="') ? url.match(/src="([^"]+)"/)?.[1] : url;
    if (src && (src.startsWith('https://calendar.google.com/') || src.startsWith('http://calendar.google.com/'))) {
      setCalendarEmbedUrl(src);
      setEmbedUrl('');
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    }
  };

  const clearSaved = () => {
    setCalendarEmbedUrl('');
    setEmbedUrl('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  };

  const handleSyncTasks = async () => {
    if (!canUseApi || !session?.provider_token || !dailyTasks?.length) return;
    setSyncLoading(true);
    setSyncResult(null);
    const today = new Date().toISOString().slice(0, 10);
    let ok = 0;
    let err = null;
    for (const task of dailyTasks) {
      const { success, error } = await createCalendarEvent(
        session.provider_token,
        selectedCalendarId,
        { summary: `[Refael OS] ${task.label}`, description: `משימה יומית · ${task.xp} XP`, date: today }
      );
      if (success) ok++;
      else err = error;
    }
    setSyncLoading(false);
    setSyncResult(err ? { error: err } : { count: ok });
    if (ok > 0) loadEvents();
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black flex items-center gap-2">
          <CalendarIcon className="text-brand" size={24} aria-hidden />
          יומן גוגל
        </h2>
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          className="flex items-center gap-2 text-sm text-brand-black/600 dark:text-on-brand-muted hover:text-brand font-medium"
        >
          <Info size={16} />
          איך לחבר?
        </button>
      </div>

      {showHelp && (
        <Card className="p-4 bg-brand-black/5 dark:bg-brand-surface border border-brand-black/10 dark:border-brand/20">
          <p className="text-sm text-brand-black dark:text-on-brand mb-2">להצגת יומן גוגל כאן:</p>
          <ol className="list-decimal list-inside text-sm text-brand-black/600 dark:text-on-brand-muted space-y-1 mb-3">
            <li>היכנס ל־<a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Google Calendar</a>.</li>
            <li>הגדרות → בחר יומן → גלול ל־&quot;אינטגרציה של היומן&quot;.</li>
            <li>העתק את קוד ההטמעה (iframe) או רק את כתובת ה־src.</li>
            <li>הדבק למטה ולחץ שמור.</li>
          </ol>
          <a
            href="https://calendar.google.com/calendar/u/0/r/settings"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-brand font-medium hover:underline"
          >
            פתח הגדרות יומן גוגל
            <ExternalLink size={14} />
          </a>
        </Card>
      )}

      {canUseApi && (
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 className="font-bold text-brand-black dark:text-on-brand">אירועים מהיומן</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-brand-black/600 dark:text-on-brand-muted">
                <CalendarDays size={14} aria-hidden />
                יומן:
              </label>
              <select
                value={selectedCalendarId}
                onChange={(e) => setSelectedCalendarId(e.target.value)}
                disabled={calendarsLoading}
                className="px-3 py-1.5 rounded-lg border border-brand-black/15 dark:border-brand/30 bg-brand-white dark:bg-brand-surface text-brand-black dark:text-on-brand text-sm min-w-[140px]"
                aria-label="בחירת יומן"
              >
                {calendarsLoading ? (
                  <option>טוען...</option>
                ) : calendars.length === 0 ? (
                  <option value="primary">יומן ראשי</option>
                ) : (
                  calendars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.summary} {c.primary ? '(ראשי)' : ''}
                    </option>
                  ))
                )}
              </select>
              <button
                type="button"
                onClick={loadEvents}
                disabled={eventsLoading}
                className="flex items-center gap-2 text-sm text-brand font-medium hover:underline disabled:opacity-60"
                aria-label="רענן אירועים"
              >
                <RefreshCw size={16} className={eventsLoading ? 'animate-spin' : ''} />
                רענן
              </button>
            </div>
          </div>
          {calendarsError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-accent-secondary/10 text-brand-accent-secondary text-sm mb-3" role="alert">
              <AlertCircle size={18} className="shrink-0" />
              <span>{calendarsError}</span>
            </div>
          )}
          {eventsError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-accent-secondary/10 text-brand-accent-secondary text-sm mb-3" role="alert">
              <AlertCircle size={18} className="shrink-0" />
              <span>{eventsError}</span>
            </div>
          )}
          {eventsLoading && events.length === 0 ? (
            <p className="text-brand-black/500 dark:text-on-brand-muted text-sm py-4">טוען אירועים...</p>
          ) : events.length === 0 && !eventsError ? (
            <p className="text-brand-black/500 dark:text-on-brand-muted text-sm py-4">אין אירועים ב־14 הימים הקרובים.</p>
          ) : (
            <ul className="space-y-2 max-h-[320px] overflow-y-auto" aria-label="אירועים מהיומן">
              {events.map((ev) => (
                <li key={ev.id}>
                  <a
                    href={ev.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-xl border border-brand-black/10 dark:border-brand/20 hover:bg-brand-black/5 dark:hover:bg-brand-dark/30 transition-colors"
                  >
                    <span className="font-medium text-brand-black dark:text-on-brand block">{ev.summary}</span>
                    <span className="flex items-center gap-2 text-sm text-brand-black/500 dark:text-on-brand-muted mt-1">
                      <Clock size={14} aria-hidden />
                      {formatEventDate(ev.start)} · {formatEventTime(ev.start, ev.isAllDay)}
                      {ev.isAllDay && ' (כל היום)'}
                    </span>
                    {ev.location && (
                      <span className="flex items-center gap-2 text-sm text-brand-black/500 dark:text-on-brand-muted mt-0.5">
                        <MapPin size={14} aria-hidden />
                        {ev.location}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {dailyTasks?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-brand-black/10 dark:border-brand/20">
              <button
                type="button"
                onClick={handleSyncTasks}
                disabled={syncLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-dark text-on-brand font-bold hover:opacity-90 disabled:opacity-60 text-sm"
              >
                <Upload size={18} className={syncLoading ? 'animate-pulse' : ''} />
                סנכרן משימות יומיות ליומן
              </button>
              {syncResult && (
                <p className={`mt-2 text-sm ${syncResult.error ? 'text-brand-accent-secondary' : 'text-brand-black/600 dark:text-on-brand-muted'}`}>
                  {syncResult.error || `נוצרו ${syncResult.count} אירועים להיום.`}
                </p>
              )}
            </div>
          )}
        </Card>
      )}

      {!savedUrl ? (
        <Card className="p-4">
          <label htmlFor="calendar-embed-url" className="block text-sm font-medium text-brand-black dark:text-on-brand mb-2">
            קישור להטמעת יומן (מגוגל קלנדר)
          </label>
          <div className="flex gap-2 flex-wrap">
            <input
              id="calendar-embed-url"
              type="text"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              placeholder="https://calendar.google.com/calendar/embed?..."
              className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-brand-black/15 dark:border-brand/30 bg-brand-white dark:bg-brand-surface text-brand-black dark:text-on-brand placeholder:text-brand-black/40 dark:placeholder-brand/50 focus:ring-2 focus:ring-brand focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={!embedUrl.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-dark text-on-brand font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <Save size={18} />
              שמור
            </button>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={clearSaved}
              className="text-sm text-brand-black/500 dark:text-on-brand-muted hover:text-brand-accent-secondary"
            >
              נתק יומן
            </button>
          </div>
          <div className="rounded-2xl border border-brand-black/10 dark:border-brand/20 overflow-hidden bg-brand-white dark:bg-brand-surface shadow-sm">
            <iframe
              title="יומן גוגל"
              src={savedUrl}
              className="w-full min-h-[500px] border-0"
              style={{ height: 'min(80vh, 700px)' }}
            />
          </div>
        </>
      )}
    </div>
  );
}
