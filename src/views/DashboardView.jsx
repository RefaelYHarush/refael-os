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
import { useApp } from '../context/AppContext';
import { XP_PER_LEVEL } from '../data/constants';

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
  const { trades, dailyTasks, userXP, userLevel, toggleTask, addTrade, addTask } = useApp();
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const weekStats = useMemo(() => {
    const last7 = getLast7Days();
    const weekTrades = trades.filter((t) => last7.has(t.date));
    const pnlWeek = weekTrades.reduce((s, t) => s + t.pnl, 0);
    const tasksDone = dailyTasks.filter((t) => t.completed).length;
    return { pnlWeek, tasksDone, total: dailyTasks.length };
  }, [trades, dailyTasks]);

  const levelProgress = Math.min(100, (userXP % XP_PER_LEVEL) / XP_PER_LEVEL * 100);
  const xpToNext = XP_PER_LEVEL - (userXP % XP_PER_LEVEL);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between h-32 bg-brand-dark text-white border-brand-dark shadow-xl shadow-brand-dark/20">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-black/30 rounded-lg backdrop-blur-sm border border-white/10">
              <Trophy size={20} className="text-brand" />
            </div>
            <span className="text-xs font-bold bg-brand/20 text-brand border border-brand/40 px-2 py-1 rounded">LVL {userLevel}</span>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1 text-white">{userXP.toLocaleString()} XP</div>
            <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
              <div className="bg-brand h-full shadow-[0_0_10px_rgba(160,223,80,0.5)]" style={{ width: `${levelProgress}%` }} />
            </div>
            <div className="text-[10px] mt-1 text-white/70">עוד {xpToNext} XP לרמה {userLevel + 1}</div>
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
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {weekStats.pnlWeek >= 0 ? '+' : ''}${weekStats.pnlWeek.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">PnL השבוע · {weekStats.tasksDone}/{weekStats.total} משימות הושלמו</div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-32 hover:border-brand/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-brand/10 dark:bg-brand/20 rounded-lg">
              <DollarSign size={20} className="text-brand-dark" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ${trades.reduce((s, t) => s + t.pnl, 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">סה״כ PnL (מסחר)</div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-32 hover:border-blue-500/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Rocket size={20} className="text-blue-500" />
            </div>
            <Badge color="blue">3 פעילים</Badge>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">$450 <span className="text-sm font-normal text-slate-400">/MRR</span></div>
            <div className="text-xs text-slate-500">הכנסות SaaS</div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-32 hover:border-purple-500/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <BookOpen size={20} className="text-purple-500" />
            </div>
            <Badge color="purple">דף ל׳</Badge>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">בבא קמא</div>
            <div className="text-xs text-slate-500">התקדמות יומית</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-slate-900 dark:text-white" /> ביצועי מסחר (7 ימים)
              </h3>
              <button type="button" className="text-sm text-slate-500 hover:text-brand transition-colors hover:underline" onClick={() => onNavigate('trading')}>לכל הנתונים</button>
            </div>
            <PnlChart data={trades.slice(0, 7)} />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 hover:border-brand transition-colors cursor-pointer group bg-gradient-to-br from-white to-slate-50 dark:from-brand-dark dark:to-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-brand-dark/20" aria-hidden>
                  <Play size={20} className="text-brand" fill="currentColor" />
                </div>
                <div>
                  <div className="font-bold">Deep Work Timer</div>
                  <div className="text-xs text-slate-500">התחל סשן עבודה (SaaS)</div>
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
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-brand/10 dark:group-hover:bg-brand/20 transition-colors" aria-hidden>
                  <Plus size={20} className="text-slate-600 dark:text-slate-400 group-hover:text-brand-dark" />
                </div>
                <div>
                  <div className="font-bold">הוסף עסקה</div>
                  <div className="text-xs text-slate-500">תיעוד מהיר ליומן</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-t-4 border-t-brand">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Zap size={18} className="text-brand" fill="currentColor" /> צ'ק ליסט יומי
              </h3>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setShowAddTask(true)} className="text-xs text-brand hover:underline font-medium">+ משימה</button>
                <span className="text-xs text-slate-400">{new Date().toLocaleDateString('he-IL')}</span>
              </div>
            </div>
            <div className="space-y-3" role="list">
              {dailyTasks.map((task) => (
                <div
                  key={task.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleTask(task.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTask(task.id); } }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-800'
                      : 'bg-white border-slate-100 hover:border-brand dark:bg-slate-900 dark:border-slate-800 dark:hover:border-brand/50'
                  }`}
                  aria-pressed={task.completed}
                  aria-label={`${task.label}, ${task.xp} XP, ${task.completed ? 'הושלמה' : 'לא הושלמה'}. לחץ לסימון`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      task.completed ? 'bg-brand-dark border-brand-dark' : 'border-slate-300 dark:border-slate-600'
                    }`} aria-hidden>
                      {task.completed && <CheckCircle2 size={14} className="text-brand" />}
                    </div>
                    <span className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                      {task.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-1.5 py-0.5 rounded">
                    +{task.xp} XP
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="bg-brand/10 dark:bg-brand/10 p-4 rounded-xl border border-brand/20 dark:border-brand/20">
                <div className="flex items-start gap-3">
                  <BrainCircuit className="text-brand-dark dark:text-brand w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-brand mb-1">Rethink יומי</div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      "אתמול היית מפוזר. המערכת זיהתה 3 כניסות לא בתוכנית. היום תתמקד ב-A+ Setups בלבד."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showAddTrade && <AddTradeModal onClose={() => setShowAddTrade(false)} onSave={addTrade} />}
      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} onSave={addTask} />}
    </div>
  );
}
