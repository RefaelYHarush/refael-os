/** Default data shapes and initial values for RAFAEL OS */

export const DEFAULT_TRADES = [
  { id: 1, date: '2025-02-01', pnl: 450, symbol: 'NQ', setup: 'Opening Range Breakout', mood: 'Calm' },
  { id: 2, date: '2025-02-02', pnl: -120, symbol: 'ES', setup: 'Reversal', mood: 'Anxious' },
  { id: 3, date: '2025-02-03', pnl: 890, symbol: 'NQ', setup: 'Trend Following', mood: 'Confident' },
  { id: 4, date: '2025-02-04', pnl: 2100, symbol: 'GC', setup: 'News Event', mood: 'Excited' },
  { id: 5, date: '2025-02-05', pnl: -350, symbol: 'NQ', setup: 'Choppy', mood: 'Bored' },
  { id: 6, date: '2025-02-06', pnl: 120, symbol: 'ES', setup: 'Scalp', mood: 'Neutral' },
  { id: 7, date: '2025-02-07', pnl: 1500, symbol: 'NQ', setup: 'Trend', mood: 'Flow' },
];

export const DEFAULT_SAAS_PROJECTS = [
  { id: 1, name: 'FaceYMatch', status: 'In Progress', mrr: 0, tasks: 12, completed: 8 },
  { id: 2, name: 'Trading Journal AI', status: 'Idea', mrr: 0, tasks: 5, completed: 0 },
  { id: 3, name: 'WhatsApp Bot', status: 'Live', mrr: 450, tasks: 20, completed: 19 },
];

export const DEFAULT_VISION_MILESTONES = [
  { year: 2025, title: "חיסול החוב & רווחיות עקבית", icon: 'DollarSign', achieved: false },
  { year: 2026, title: "הון עצמי $100K + SaaS ראשון מכניס", icon: 'Rocket', achieved: false },
  { year: 2027, title: "חתונה & בית ראשון", icon: 'Heart', achieved: false },
  { year: 2028, title: "תיק השקעות $500K", icon: 'TrendingUp', achieved: false },
  { year: 2030, title: "חופש כלכלי מלא ($2M Net Worth)", icon: 'Trophy', achieved: false },
];

export const DEFAULT_DAILY_TASKS = [
  { id: 'prayer', label: 'תפילת שחרית ומתיחות', xp: 50, completed: true },
  { id: 'dafYomi', label: 'דף יומי (בבא קמא)', xp: 100, completed: false },
  { id: 'workout', label: 'אימון כושר', xp: 80, completed: true },
  { id: 'news', label: 'חדשות מסחר', xp: 20, completed: true },
  { id: 'journal', label: 'כתיבת יומן מסחר', xp: 50, completed: false },
];

export const INITIAL_XP = 2450;
export const INITIAL_LEVEL = 4;
export const XP_PER_LEVEL = 500;

export const STORAGE_KEYS = {
  TRADES: 'rafael_os_trades',
  SAAS_PROJECTS: 'rafael_os_saas',
  VISION: 'rafael_os_vision',
  DAILY_TASKS: 'rafael_os_daily_tasks',
  USER_XP: 'rafael_os_user_xp',
  USER_LEVEL: 'rafael_os_user_level',
};
