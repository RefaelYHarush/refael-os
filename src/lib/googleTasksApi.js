/**
 * Google Tasks API – קריאות ל־REST עם access token (מ־Supabase session לאחר התחברות Google).
 * Scope נדרש: https://www.googleapis.com/auth/tasks
 */

const TASKS_API_BASE = 'https://tasks.googleapis.com/tasks/v1';

function authHeaders(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

/**
 * @param {string} accessToken
 * @returns {Promise<{ id: string, title: string }[]>}
 */
export async function getTaskLists(accessToken) {
  const res = await fetch(`${TASKS_API_BASE}/users/@me/lists`, {
    headers: authHeaders(accessToken),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Tasks API ${res.status}`);
  }
  const data = await res.json();
  return (data.items || []).map((l) => ({ id: l.id, title: l.title || 'ללא שם' }));
}

/**
 * @param {string} accessToken
 * @param {string} taskListId
 * @param {{ showCompleted?: boolean, showHidden?: boolean }} [opts]
 * @returns {Promise<{ id: string, title: string, status: string, completed?: string, due?: string }[]>}
 */
export async function getTasks(accessToken, taskListId, opts = {}) {
  const params = new URLSearchParams();
  if (opts.showCompleted !== false) params.set('showCompleted', 'true');
  if (opts.showHidden) params.set('showHidden', 'true');
  const qs = params.toString();
  const url = `${TASKS_API_BASE}/lists/${encodeURIComponent(taskListId)}/tasks${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: authHeaders(accessToken) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Tasks API ${res.status}`);
  }
  const data = await res.json();
  return (data.items || []).map((t) => ({
    id: t.id,
    title: t.title || '',
    status: t.status || 'needsAction',
    completed: t.completed,
    due: t.due,
    notes: t.notes,
  }));
}

/**
 * @param {string} accessToken
 * @param {string} taskListId
 * @param {{ title: string, notes?: string, due?: string }} task
 * @returns {Promise<{ id: string, title: string, status: string }>}
 */
export async function insertTask(accessToken, taskListId, task) {
  const res = await fetch(`${TASKS_API_BASE}/lists/${encodeURIComponent(taskListId)}/tasks`, {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify({
      title: task.title,
      notes: task.notes || undefined,
      due: task.due || undefined,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Tasks API ${res.status}`);
  }
  const data = await res.json();
  return {
    id: data.id,
    title: data.title || task.title,
    status: data.status || 'needsAction',
  };
}

/**
 * @param {string} accessToken
 * @param {string} taskListId
 * @param {string} taskId
 * @param {{ status?: 'completed'|'needsAction', title?: string }} updates
 * @returns {Promise<void>}
 */
export async function updateTask(accessToken, taskListId, taskId, updates) {
  const body = {};
  if (updates.status) body.status = updates.status;
  if (updates.title !== undefined) body.title = updates.title;
  const res = await fetch(
    `${TASKS_API_BASE}/lists/${encodeURIComponent(taskListId)}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: 'PATCH',
      headers: authHeaders(accessToken),
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Tasks API ${res.status}`);
  }
}

/**
 * @param {string} accessToken
 * @param {string} taskListId
 * @param {string} taskId
 * @returns {Promise<void>}
 */
export async function deleteTask(accessToken, taskListId, taskId) {
  const res = await fetch(
    `${TASKS_API_BASE}/lists/${encodeURIComponent(taskListId)}/tasks/${encodeURIComponent(taskId)}`,
    { method: 'DELETE', headers: authHeaders(accessToken) }
  );
  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Tasks API ${res.status}`);
  }
}
