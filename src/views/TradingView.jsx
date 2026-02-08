import React, { useState } from 'react';
import { Plus, Calendar, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AddTradeModal } from '../components/modals/AddTradeModal';
import { TradeDetailModal } from '../components/modals/TradeDetailModal';
import { useApp } from '../context/AppContext';

function DayTradesModal({ dateStr, tradesOnDay, onClose, onAddTrade }) {
  const displayDate = dateStr ? new Date(dateStr + 'T12:00:00').toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-black/40 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="day-trades-title">
      <Card className="w-full max-w-sm p-6 shadow-card-dark" onClick={(e) => e.stopPropagation()} dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h3 id="day-trades-title" className="text-lg font-bold text-brand-black dark:text-on-brand">עסקאות ביום {displayDate}</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-button hover:bg-brand-black/5 dark:hover:bg-brand/10 text-brand-black/60 dark:text-on-brand-muted" aria-label="סגור">✕</button>
        </div>
        {tradesOnDay.length === 0 ? (
          <p className="text-brand-black/55 dark:text-on-brand-muted text-sm mb-4">אין עסקאות ביום זה</p>
        ) : (
          <ul className="space-y-2 mb-4" role="list">
            {tradesOnDay.map((t) => (
              <li key={t.id} className="flex justify-between items-center py-2 border-b border-brand-black/8 dark:border-brand/15 last:border-0">
                <span className="font-medium text-brand-black dark:text-on-brand">{t.symbol}</span>
                <span className={t.pnl >= 0 ? 'text-brand-dark dark:text-brand font-semibold' : 'text-brand-accent-secondary'}>
                  {t.pnl >= 0 ? '+' : ''}{t.pnl}$
                </span>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => { onAddTrade(dateStr); onClose(); }}
          className="w-full py-2.5 rounded-button bg-brand-dark text-[var(--text-on-dark)] font-bold flex items-center justify-center gap-2 hover:opacity-95"
        >
          <Plus size={18} /> הוסף עסקה ליום זה
        </button>
      </Card>
    </div>
  );
}

export function TradingView() {
  const { trades, addTrade, updateTrade, deleteTrade } = useApp();
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [addTradeInitialDate, setAddTradeInitialDate] = useState(undefined);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [selectedDayDate, setSelectedDayDate] = useState(null);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const monthName = now.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const monthTrades = trades.filter((t) => {
    const [y, m] = t.date.split('-').map(Number);
    return y === currentYear && m === currentMonth + 1;
  });
  const monthPnL = monthTrades.reduce((sum, t) => sum + t.pnl, 0);
  const wins = monthTrades.filter((t) => t.pnl > 0).length;
  const winRate = monthTrades.length ? Math.round((wins / monthTrades.length) * 100) : 0;
  const avgWin = wins ? Math.round(monthTrades.filter((t) => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / wins) : 0;
  const losses = monthTrades.filter((t) => t.pnl < 0);
  const avgLoss = losses.length ? Math.round(losses.reduce((s, t) => s + t.pnl, 0) / losses.length) : 0;

  const weekdays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  const emptyCells = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const tradesForSelectedDay = selectedDayDate
    ? trades.filter((t) => t.date === selectedDayDate)
    : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-black dark:text-on-brand">יומן מסחר</h2>
        <button
          onClick={() => { setAddTradeInitialDate(undefined); setShowAddTrade(true); }}
          className="bg-brand-dark hover:opacity-95 dark:bg-brand dark:hover:bg-brand/90 dark:text-brand-dark text-[var(--text-on-dark)] dark:text-brand-dark px-4 py-2.5 rounded-button text-sm font-bold flex items-center gap-2 shadow-card"
        >
          <Plus size={16} /> עסקה חדשה
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="text-brand-dark dark:text-brand" size={20} />
            <h3 className="font-bold text-brand-black dark:text-on-brand">{monthName}</h3>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekdays.map((d) => (
              <div key={d} className="text-center text-xs text-brand-black/45 dark:text-on-brand-muted py-2">{d}</div>
            ))}
            {Array.from({ length: emptyCells }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-button bg-transparent" aria-hidden />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayTrades = monthTrades.filter((t) => t.date === dateStr);
              const trade = dayTrades[0];
              const hasMultiple = dayTrades.length > 1;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDayDate(dateStr)}
                  className="aspect-square border border-brand-black/10 dark:border-brand/20 rounded-button p-1 relative hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors cursor-pointer text-right"
                  aria-label={`יום ${day}, ${dayTrades.length ? `${dayTrades.length} עסקאות` : 'אין עסקאות'}. לחץ לפרטים`}
                >
                  <span className="text-xs text-brand-black/45 dark:text-on-brand-muted absolute top-1 right-2">{day}</span>
                  {trade && (
                    <div className={`absolute inset-x-1 bottom-1 top-6 rounded flex items-center justify-center text-xs font-bold ${
                      trade.pnl > 0 ? 'bg-brand/20 text-brand-dark dark:bg-brand/25 dark:text-brand' : 'bg-brand-accent-secondary/15 text-brand-accent-secondary'
                    }`}>
                      {hasMultiple ? `${dayTrades.length} עסקאות` : (trade.pnl > 0 ? '+' : '') + trade.pnl + '$'}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-brand-black dark:text-on-brand mb-4">סטטיסטיקה חודשית</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-brand-black/55 dark:text-on-brand-muted text-sm">סה"כ P&L</span>
                <span className="font-bold text-brand-dark dark:text-brand">+${monthPnL.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-black/55 dark:text-on-brand-muted text-sm">Win Rate</span>
                <span className="font-bold text-brand-black dark:text-on-brand">{winRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-black/55 dark:text-on-brand-muted text-sm">Avg Win</span>
                <span className="font-bold text-brand-dark dark:text-brand">+${avgWin}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-black/55 dark:text-on-brand-muted text-sm">Avg Loss</span>
                <span className="font-bold text-brand-accent-secondary">{avgLoss}$</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-brand-black/5 dark:bg-brand/10 text-brand-black/55 dark:text-on-brand-muted">
              <tr>
                <th className="p-4 font-semibold">תאריך</th>
                <th className="p-4 font-semibold">נכס</th>
                <th className="p-4 font-semibold">אסטרטגיה</th>
                <th className="p-4 font-semibold">מצב רוח</th>
                <th className="p-4 font-semibold">P&L</th>
                <th className="p-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/8 dark:divide-brand/15">
              {trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors">
                  <td className="p-4 text-brand-black dark:text-on-brand">{trade.date}</td>
                  <td className="p-4 font-bold text-brand-black dark:text-on-brand">{trade.symbol}</td>
                  <td className="p-4"><Badge color="blue">{trade.setup}</Badge></td>
                  <td className="p-4 text-brand-black/65 dark:text-on-brand-muted">{trade.mood}</td>
                  <td className={`p-4 font-bold ${trade.pnl > 0 ? 'text-brand-dark dark:text-brand' : 'text-brand-accent-secondary'}`}>
                    {trade.pnl > 0 ? '+' : ''}{trade.pnl}$
                  </td>
                  <td className="p-4 text-left">
                    <button type="button" onClick={() => setSelectedTrade(trade)} className="text-brand-black/45 dark:text-on-brand-muted hover:text-brand-dark dark:hover:text-brand transition-colors" aria-label="פרטי עסקה"><ChevronRight size={18} aria-hidden /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedDayDate && (
        <DayTradesModal
          dateStr={selectedDayDate}
          tradesOnDay={tradesForSelectedDay}
          onClose={() => setSelectedDayDate(null)}
          onAddTrade={(dateStr) => { setAddTradeInitialDate(dateStr); setShowAddTrade(true); setSelectedDayDate(null); }}
        />
      )}
      {showAddTrade && (
        <AddTradeModal
          key={addTradeInitialDate ?? 'today'}
          initialDate={addTradeInitialDate}
          onClose={() => { setShowAddTrade(false); setAddTradeInitialDate(undefined); }}
          onSave={addTrade}
        />
      )}
      {selectedTrade && (
        <TradeDetailModal
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
          onUpdate={(updated) => { updateTrade(updated); setSelectedTrade(updated); }}
          onDelete={deleteTrade}
        />
      )}
    </div>
  );
}
