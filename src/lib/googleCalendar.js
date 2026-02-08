/**
 * קריאה ל-Google Calendar API באמצעות provider_token מהתחברות גוגל (Supabase).
 * דורש שהמשתמש התחבר עם גוגל ואישר scope: calendar.readonly
 */

const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

/**
 * מחזיר אירועים מיומן גוגל (ברירת מחדל: primary) לתקופה נתונה.
 * @param {string} accessToken - provider_token מהסשן (Supabase session.provider_token)
 * @param {Object} options
 * @param {string} [options.calendarId='primary'] - מזהה יומן (primary = היומן הראשי)
 * @param {Date} [options.timeMin] - התחלת טווח (ברירת מחדל: תחילת היום)
 * @param {Date} [options.timeMax] - סוף טווח (ברירת מחדל: 14 ימים קדימה)
 * @param {number} [options.maxResults=50] - מקסימום אירועים
 * @returns {Promise<{ events: Array, error?: string }>}
 */
export async function fetchCalendarEvents(accessToken, options = {}) {
  if (!accessToken) {
    return { events: [], error: 'חסר טוקן גישה' };
  }

  const calendarId = options.calendarId || 'primary';
  const maxResults = options.maxResults ?? 50;

  const now = new Date();
  const timeMin = options.timeMin || new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const timeMax = options.timeMax || new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: String(maxResults),
  });

  const url = `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events?${params}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = body.error?.message || res.statusText;
      if (res.status === 401) return { events: [], error: 'הגישה פגה – נא להתחבר מחדש עם גוגל' };
      return { events: [], error: msg };
    }

    const data = await res.json();
    const events = (data.items || []).map((e) => ({
      id: e.id,
      summary: e.summary || '(ללא כותרת)',
      description: e.description || '',
      location: e.location || '',
      start: e.start?.dateTime || e.start?.date,
      end: e.end?.dateTime || e.end?.date,
      isAllDay: !e.start?.dateTime,
      htmlLink: e.htmlLink,
    }));

    return { events };
  } catch (err) {
    return { events: [], error: err.message || 'שגיאה בטעינת האירועים' };
  }
}

/**
 * רשימת היומנים של המשתמש (לקריאה בלבד).
 * @param {string} accessToken - provider_token
 * @returns {Promise<{ calendars: Array<{ id: string, summary: string, primary?: boolean }>, error?: string }>}
 */
export async function fetchCalendarList(accessToken) {
  if (!accessToken) return { calendars: [], error: 'חסר טוקן גישה' };
  const url = `${CALENDAR_API}/users/me/calendarList?minAccessRole=reader`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = body.error?.message || res.statusText;
      if (res.status === 401) return { calendars: [], error: 'הגישה פגה – נא להתחבר מחדש עם גוגל' };
      return { calendars: [], error: msg };
    }
    const data = await res.json();
    const calendars = (data.items || []).map((c) => ({
      id: c.id,
      summary: c.summary || c.id,
      primary: !!c.primary,
    }));
    return { calendars };
  } catch (err) {
    return { calendars: [], error: err.message || 'שגיאה בטעינת היומנים' };
  }
}

/**
 * יוצר אירוע ביומן גוגל (דורש scope calendar.events).
 * @param {string} accessToken - provider_token
 * @param {string} calendarId - מזהה יומן (למשל primary)
 * @param {{ summary: string, description?: string, date?: string }} options - date ב-YYYY-MM-DD לאירוע כל היום
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function createCalendarEvent(accessToken, calendarId, options) {
  if (!accessToken) return { success: false, error: 'חסר טוקן גישה' };
  const url = `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`;
  const date = options.date || new Date().toISOString().slice(0, 10);
  const body = {
    summary: options.summary || 'משימה',
    description: options.description || '',
    start: { date },
    end: { date },
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const msg = data.error?.message || res.statusText;
      if (res.status === 401) return { success: false, error: 'הגישה פגה – נא להתחבר מחדש עם גוגל' };
      if (res.status === 403) return { success: false, error: 'אין הרשאת כתיבה ליומן – נא לאשר גישה ליומן בהתחברות' };
      return { success: false, error: msg };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'שגיאה ביצירת אירוע' };
  }
}

/**
 * בודק אם יש טוקן גישה ליומן גוגל (התחברות עם גוגל + אישור scope יומן).
 * @param {import('@supabase/supabase-js').Session | null} session
 * @returns {boolean}
 */
export function hasGoogleCalendarAccess(session) {
  return Boolean(session?.provider_token);
}
