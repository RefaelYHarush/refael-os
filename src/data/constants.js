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

/** סדר תצוגה מומלץ: בוקר → עבודה/מסחר → ערב. משימות מותאמות אישית (id שמתחיל ב-custom-) יופיעו בסוף. */
export const TASK_DISPLAY_ORDER = [
  'prayer',
  'meditation',
  'dafYomi',
  'news',
  'workout',
  'hydration',
  'deepWork',
  'reading',
  'learning',
  'prepMarket',
  'journal',
  'review',
  'planning',
  'reflection',
  'noScreens',
  'sleep',
];

/** משימות יומיות ברירת מחדל – מקובצות לוגית: בוקר, פוקוס, מסחר, ערב/שינה */
export const DEFAULT_DAILY_TASKS = [
  // בוקר
  { id: 'prayer', label: 'תפילת שחרית ומתיחות', xp: 50, completed: false },
  { id: 'meditation', label: 'מדיטציה / נשימות (5 דק׳)', xp: 25, completed: false },
  { id: 'dafYomi', label: 'דף יומי (בבא קמא)', xp: 100, completed: false },
  { id: 'news', label: 'חדשות מסחר', xp: 20, completed: false },
  { id: 'workout', label: 'אימון כושר', xp: 80, completed: false },
  // בריאות לאורך היום
  { id: 'hydration', label: 'שתיית מים (מעקב)', xp: 15, completed: false },
  // פוקוס ועבודה
  { id: 'deepWork', label: 'סשן Deep Work (25 דקות)', xp: 60, completed: false },
  { id: 'reading', label: 'קריאה (ספר/מאמר)', xp: 40, completed: false },
  { id: 'learning', label: 'למידה (קורס/וידאו)', xp: 45, completed: false },
  // מסחר
  { id: 'prepMarket', label: 'הכנה לשוק / תכנית מסחר', xp: 55, completed: false },
  { id: 'journal', label: 'כתיבת יומן מסחר', xp: 50, completed: false },
  { id: 'review', label: 'סקירת עסקאות השבוע', xp: 70, completed: false },
  // ערב
  { id: 'planning', label: 'תכנון יום המחר', xp: 30, completed: false },
  { id: 'reflection', label: 'רפלקציה יומית (3 דברים טובים)', xp: 35, completed: false },
  { id: 'noScreens', label: 'ללא מסכים שעה לפני שינה', xp: 35, completed: false },
  { id: 'sleep', label: 'שינה מספקת (7+ שעות)', xp: 40, completed: false },
];

export const INITIAL_XP = 2450;
export const INITIAL_LEVEL = 4;
export const XP_PER_LEVEL = 500;

// מפתחות אחסון (localStorage). נשארו rafael_os מטעמי תאימות עם נתונים קיימים.
export const STORAGE_KEYS = {
  TRADES: 'rafael_os_trades',
  SAAS_PROJECTS: 'rafael_os_saas',
  VISION: 'rafael_os_vision',
  DAILY_TASKS: 'rafael_os_daily_tasks',
  USER_XP: 'rafael_os_user_xp',
  USER_LEVEL: 'rafael_os_user_level',
  HEALTH: 'rafael_os_health',
  LEARNING: 'rafael_os_learning',
  FINANCE: 'rafael_os_finance',
  RELATIONSHIPS: 'rafael_os_relationships',
};

/** רשומות בריאות – אימונים, שינה, מים. ברירת מחדל: מערך ריק. */
export const DEFAULT_HEALTH_ENTRIES = [];

/** פריטי למידה – קורסים, ספרים, מיומנויות. ברירת מחדל: מערך ריק. */
export const DEFAULT_LEARNING_ITEMS = [];

/** יעדי כספים – חיסכון. ברירת מחדל: מערך ריק. */
export const DEFAULT_FINANCE_GOALS = [];

/** אנשי קשר – מעקב מגע. ברירת מחדל: מערך ריק. */
export const DEFAULT_RELATIONSHIP_ITEMS = [];

/** קטגוריות שאפשר להציג – דשבורד תמיד מוצג */
export const ALL_CATEGORY_IDS = ['dashboard', 'trading', 'saas', 'vision', 'calendar', 'health', 'learning', 'finance', 'relationships'];

/** ברירת מחדל: כל הקטגוריות (למשתמשים קיימים בלי מפתח אונבורדינג) */
export const DEFAULT_ENABLED_CATEGORIES = [...ALL_CATEGORY_IDS];

/** מפתח אחסון להעדפות אונבורדינג (לפי משתמש) */
export function getOnboardingStorageKey(userId) {
  return userId ? `rafael_os_onboarding_${userId}` : 'rafael_os_onboarding';
}
