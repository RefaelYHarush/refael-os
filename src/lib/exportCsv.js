/**
 * Build a CSV string and trigger download (UTF-8 with BOM for Excel Hebrew support).
 */
function downloadCsv(filename, csvString) {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvString], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeCsvCell(value) {
  const s = String(value ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export function exportTradesToCsv(trades) {
  const headers = ['תאריך', 'PnL', 'סימבול', 'סט-אפ', 'מצב רוח'];
  const rows = trades.map((t) => [
    t.date,
    t.pnl,
    t.symbol,
    t.setup,
    t.mood,
  ]);
  const lines = [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.map(escapeCsvCell).join(','))];
  const csv = lines.join('\n');
  const date = new Date().toISOString().slice(0, 10);
  downloadCsv(`refael-os-trades-${date}.csv`, csv);
}

export function exportDailyTasksToCsv(dailyTasks) {
  const headers = ['משימה', 'XP', 'הושלמה'];
  const rows = dailyTasks.map((t) => [t.label, t.xp, t.completed ? 'כן' : 'לא']);
  const lines = [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.map(escapeCsvCell).join(','))];
  const csv = lines.join('\n');
  const date = new Date().toISOString().slice(0, 10);
  downloadCsv(`refael-os-tasks-${date}.csv`, csv);
}
