import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Rocket, BookOpen, CheckCircle2, Plus, DollarSign,
  Zap, BrainCircuit, Play, Trophy, BarChart3
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PnlChart } from '../components/charts/PnlChart';
import { AddTradeModal } from '../components/modals/AddTradeModal';
import { AddTaskModal } from '../components/modals/AddTaskModal';
import { DeepWorkTimerModal } from '../components/modals/DeepWorkTimerModal';
import { GoogleTasksCard } from '../components/GoogleTasksCard';
import { useApp } from '../context/AppContext';
import { XP_PER_LEVEL, TASK_DISPLAY_ORDER } from '../data/constants';

function getLast7Days() {
  const d = new Date();
  const set = new Set();
  for (let i = 0; i < 7; i++) {
    set.add(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() - 1);
  }
  return set;
}

export function DashboardView({ onNavigate }) {
  const { trades, dailyTasks, saasProjects, userXP, userLevel, toggleTask, addTrade, addTask } = useApp();
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const saasStats = useMemo(() => {
    const live = saasProjects.filter((p) => p.status === 'Live' || p.status === 'In Progress');
    const mrr = saasProjects.reduce((s, p) => s + (p.mrr || 0), 0);
    return { activeCount: live.length, mrr };
  }, [saasProjects]);

  const dafYomiTask = useMemo(() => dailyTasks.find((t) => t.label.includes('דף')), [dailyTasks]);

  const sortedDailyTasks = useMemo(() => {
    const order = (id) => {
      const i = TASK_DISPLAY_ORDER.indexOf(id);
      return i >= 0 ? i : TASK_DISPLAY_ORDER.length + 1;
    };
    return [...dailyTasks].sort((a, b) => order(a.id) - order(b.id));
  }, [dailyTasks]);

  const weekStats = useMemo(() => {
    const last7 = getLast7Days();
    const weekTrades = trades.filter((t) => last7.has(t.date));
    const pnlWeek = weekTrades.reduce((s, t) => s + t.pnl, 0);
    const tasksDone = dailyTasks.filter((t) => t.completed).length;
    return { pnlWeek, tasksDone, total: dailyTasks.length };
  }, [trades, dailyTasks]);

  const last7DaysChartData = useMemo(() => {
    const last7 = getLast7Days();
    return [...trades]
      .filter((t) => last7.has(t.date))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);
  }, [trades]);

  const rethinkMessage = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const yesterdayTrades = trades.filter((t) => t.date === yesterdayStr);
    const count = yesterdayTrades.length;
    const wins = yesterdayTrades.filter((t) => t.pnl > 0).length;
    const winRate = count ? Math.round((wins / count) * 100) : 0;
    const pnl = yesterdayTrades.reduce((s, t) => s + t.pnl, 0);
    const tasksDoneToday = dailyTasks.filter((t) => t.completed).length;
    const tasksTotal = dailyTasks.length;

    if (count === 0) return 'אתמול לא תועדו עסקאות. היום תעדכן יומן ותתמקד ב־Setups עם edge ברור.';
    if (count >= 5 && winRate < 50) return 'אתמול הרבה תנועה ו־Win Rate נמוך. היום איכות על כמות – פחות עסקאות, יותר מיקוד.';
    if (winRate >= 70 && pnl > 0) return `אתמול ביצועים מעולים (${winRate}% Win Rate). המשך באותה משמעת.`;
    if (winRate < 50) return 'אתמול היו כניסות לא אידיאליות. היום רק Setups עם edge ברור – אל תאלץ.';
    if (tasksDoneToday >= tasksTotal && tasksTotal > 0) return 'כל המשימות היומיות הושלמו. המשך להקפיד על רישום ו־review.';
    return 'היום תתמקד ב־A+ Setups בלבד. תעדכן יומן ותסקור את אתמול.';
  }, [trades, dailyTasks]);

  const levelProgress = Math.min(100, (userXP % XP_PER_LEVEL) / XP_PER_LEVEL * 100);
  const xpToNext = XP_PER_LEVEL - (userXP % XP_PER_LEVEL);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="sr-only">דשבורד – סיכום יומי</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between h-32 bg-brand-dark text-on-brand border-brand-dark shadow-xl shadow-brand-dark/20">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-brand-black/30 rounded-lg backdrop-blur-sm border border-brand/20">
              <Trophy size={20} className="text-brand" aria-hidden />
            </div>
            <span className="text-xs font-bold bg-brand/20 text-brand border border-brand/40 px-2 py-1 rounded">LVL {userLevel}</span>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1 text-on-brand">{userXP.toLocaleString()} XP</div>
            <div className="w-full bg-brand-black/30 h-1.5 rounded-full overflow-hidden">
              <div className="bg-brand h-full shadow-brand-glow rounded-full" style={{ width: `${levelProgress}%` }} />
            </div>
            <div className="text-[10px] mt-1 text-on-brand-muted">עוד {xpToNext} XP לרמה {userLevel + 1}</div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-32 hover:border-brand/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-brand/10 dark:bg-brand/20 rounded-lg">
              <BarChart3 size={20} className="text-brand-dark dark:text-brand" />
            </div>
            <Badge color="emerald">7 ימים</Badge>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-on-brand">
              {weekStats.pnlWeek >= 0 ? '+' : ''}${weekStats.pnlWeek.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-on-brand-muted">PnL השבוע · {weekStats.tasksDone}/{weekStats.total} משימות הושלמו</div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-32 hover:border-brand/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-brand/10 dark:bg-brand/20 rounded-lg">
              <DollarSign size={20} className="text-brand-dark dark:text-brand" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-on-brand">
              ${trades.reduce((s, t) => s + t.pnl, 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-on-brand-muted">סה״כ PnL (מסחר)</div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-32 hover:border-brand/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-brand/10 dark:bg-brand/20 rounded-lg">
              <Rocket size={20} className="text-brand-dark dark:text-brand" />
            </div>
            <Badge color="blue">{saasStats.activeCount} פעילים</Badge>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-on-brand">${saasStats.mrr.toLocaleString()} <span className="text-sm font-normal text-slate-400 dark:text-on-brand-muted">/MRR</span></div>
            <div className="text-xs text-slate-500 dark:text-on-brand-muted">הכנסות SaaS</div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-32 hover:border-brand/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-brand/10 dark:bg-brand/20 rounded-lg">
              <BookOpen size={20} className="text-brand-dark dark:text-brand" />
            </div>
            <Badge color="purple">דף ל׳</Badge>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-on-brand">{dafYomiTask ? (dafYomiTask.label.match(/\(([^)]+)\)/)?.[1] || dafYomiTask.label) : 'דף יומי'}</div>
            <div className="text-xs text-slate-500 dark:text-on-brand-muted">התקדמות יומית</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-on-brand">
                <TrendingUp size={20} className="text-brand-dark dark:text-brand" /> ביצועי מסחר (7 ימים)
              </h3>
              <button type="button" className="text-sm text-slate-500 dark:text-on-brand-muted hover:text-brand transition-colors hover:underline" onClick={() => onNavigate('trading')}>לכל הנתונים</button>
            </div>
            {last7DaysChartData.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                <p>אין נתונים ל־7 הימים האחרונים</p>
                <button type="button" onClick={() => onNavigate('trading')} className="text-brand-dark dark:text-brand font-medium hover:underline">הוסף עסקה ביומן המסחר</button>
              </div>
            ) : (
              <PnlChart data={last7DaysChartData} />
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="p-5 hover:border-brand transition-colors cursor-pointer group bg-gradient-to-br from-white to-slate-50 dark:from-brand-dark dark:to-slate-800"
              onClick={() => setShowTimer(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowTimer(true); } }}
              aria-label="התחל טיימר Deep Work – סשן עבודה 25 דקות"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-brand-dark/20" aria-hidden>
                  <Play size={20} className="text-brand" fill="currentColor" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-on-brand">Deep Work Timer</div>
                  <div className="text-xs text-slate-500 dark:text-on-brand-muted">התחל סשן עבודה (25 דקות)</div>
                </div>
              </div>
            </Card>
            <Card
              className="p-5 hover:border-brand transition-colors cursor-pointer group"
              onClick={() => setShowAddTrade(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowAddTrade(true); } }}
              aria-label="הוסף עסקה – תיעוד מהיר ליומן"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-brand/10 flex items-center justify-center group-hover:bg-brand/10 dark:group-hover:bg-brand/20 transition-colors" aria-hidden>
                  <Plus size={20} className="text-slate-600 dark:text-on-brand-muted group-hover:text-brand-dark dark:group-hover:text-brand" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-on-brand">הוסף עסקה</div>
                  <div className="text-xs text-slate-500 dark:text-on-brand-muted">תיעוד מהיר ליומן</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-t-4 border-t-brand">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-on-brand">
                <Zap size={18} className="text-brand" fill="currentColor" /> צ'ק ליסט יומי
              </h3>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setShowAddTask(true)} className="text-xs text-brand hover:underline font-medium py-2 px-3 -my-1 -mx-1 rounded-lg touch-target-min inline-flex items-center">+ משימה</button>
                <span className="text-xs text-slate-400 dark:text-on-brand-muted">{new Date().toLocaleDateString('he-IL')}</span>
              </div>
            </div>
            <div className="space-y-3" role="list">
              {sortedDailyTasks.map((task) => (
                <div
                  key={task.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleTask(task.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTask(task.id); } }}
                  className={`flex items-center justify-between p-3 min-h-[44px] rounded-xl border transition-all cursor-pointer touch-manipulation ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200 dark:bg-brand-dark/40 dark:border-brand-dark/50'
                      : 'bg-white border-slate-100 hover:border-brand dark:bg-brand-surface dark:border-brand-dark/50 dark:hover:border-brand/50'
                  }`}
                  aria-pressed={task.completed}
                  aria-label={`${task.label}, ${task.xp} XP, ${task.completed ? 'הושלמה' : 'לא הושלמה'}. לחץ לסימון`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      task.completed ? 'bg-brand-dark border-brand-dark' : 'border-slate-300 dark:border-on-brand-muted'
                    }`} aria-hidden>
                      {task.completed && <CheckCircle2 size={14} className="text-brand" />}
                    </div>
                    <span className={`text-sm ${task.completed ? 'text-slate-400 line-through dark:text-on-brand-muted' : 'text-slate-700 dark:text-on-brand'}`}>
                      {task.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-on-brand-muted bg-slate-100 dark:bg-brand-dark/60 px-1.5 py-0.5 rounded">
                    +{task.xp} XP
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-brand-dark/50">
              <div className="bg-brand/10 dark:bg-brand/10 p-4 rounded-xl border border-brand/20 dark:border-brand/20">
                <div className="flex items-start gap-3">
                  <BrainCircuit className="text-brand-dark dark:text-brand w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-brand mb-1">Rethink יומי</div>
                    <p className="text-xs text-slate-600 dark:text-on-brand-muted leading-relaxed">
                      {rethinkMessage}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <GoogleTasksCard />
        </div>
      </div>

      {showAddTrade && <AddTradeModal onClose={() => setShowAddTrade(false)} onSave={addTrade} />}
      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} onSave={addTask} />}
      {showTimer && <DeepWorkTimerModal onClose={() => setShowTimer(false)} />}
    </div>
  );
}
