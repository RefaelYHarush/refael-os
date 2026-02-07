import { supabase } from './supabase';
import {
  DEFAULT_TRADES,
  DEFAULT_SAAS_PROJECTS,
  DEFAULT_VISION_MILESTONES,
  DEFAULT_DAILY_TASKS,
  INITIAL_XP,
  INITIAL_LEVEL,
} from '../data/constants';

/** userId must be the authenticated user's id (auth.uid() as string) */
export async function loadAll(userId) {
  if (!supabase || !userId) return null;

  const [tradesRes, saasRes, visionRes, tasksRes, profileRes] = await Promise.all([
    supabase.from('trades').select('*').eq('user_id', userId).order('id', { ascending: false }),
    supabase.from('saas_projects').select('*').eq('user_id', userId).order('id', { ascending: true }),
    supabase.from('vision_milestones').select('*').eq('user_id', userId).order('year', { ascending: true }),
    supabase.from('daily_tasks').select('*').eq('user_id', userId),
    supabase.from('user_profile').select('*').eq('user_id', userId).single(),
  ]);

  const hasTrades = tradesRes.data?.length > 0;
  const hasSaas = saasRes.data?.length > 0;
  const hasVision = visionRes.data?.length > 0;
  const hasTasks = tasksRes.data?.length > 0;

  if (!hasTrades && !hasSaas && !hasVision && !hasTasks) {
    await seedDefaults(userId);
    return loadAll(userId);
  }

  const profile = profileRes.data || { xp: INITIAL_XP, level: INITIAL_LEVEL, display_name: '' };

  return {
    trades: (tradesRes.data || []).map((r) => ({
      id: r.id,
      date: r.date,
      pnl: r.pnl,
      symbol: r.symbol,
      setup: r.setup,
      mood: r.mood,
    })),
    saasProjects: (saasRes.data || []).map((r) => ({
      id: r.id,
      name: r.name,
      status: r.status,
      mrr: r.mrr,
      tasks: r.tasks,
      completed: r.completed,
    })),
    visionMilestones: (visionRes.data || []).map((r) => ({
      id: r.id,
      year: r.year,
      title: r.title,
      icon: r.icon,
      achieved: r.achieved,
    })),
    dailyTasks: (tasksRes.data || []).map((r) => ({
      id: r.id,
      label: r.label,
      xp: r.xp,
      completed: r.completed,
    })),
    userXP: profile.xp ?? INITIAL_XP,
    userLevel: profile.level ?? INITIAL_LEVEL,
    displayName: profile.display_name ?? '',
  };
}

export async function seedDefaults(userId) {
  if (!supabase || !userId) return;

  await Promise.all([
    supabase.from('trades').insert(
      DEFAULT_TRADES.map((t) => ({
        user_id: userId,
        date: t.date,
        pnl: t.pnl,
        symbol: t.symbol,
        setup: t.setup,
        mood: t.mood,
      }))
    ),
    supabase.from('saas_projects').insert(
      DEFAULT_SAAS_PROJECTS.map((p) => ({
        user_id: userId,
        name: p.name,
        status: p.status,
        mrr: p.mrr,
        tasks: p.tasks,
        completed: p.completed,
      }))
    ),
    supabase.from('vision_milestones').insert(
      DEFAULT_VISION_MILESTONES.map((m) => ({
        user_id: userId,
        year: m.year,
        title: m.title,
        icon: m.icon,
        achieved: m.achieved,
      }))
    ),
    supabase.from('daily_tasks').insert(
      DEFAULT_DAILY_TASKS.map((t) => ({
        id: t.id,
        user_id: userId,
        label: t.label,
        xp: t.xp,
        completed: t.completed,
      }))
    ),
    supabase.from('user_profile').upsert(
      { user_id: userId, xp: INITIAL_XP, level: INITIAL_LEVEL, display_name: '', updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    ),
  ]);
}

export async function saveTrades(userId, trades) {
  if (!supabase || !userId) return;
  await supabase.from('trades').delete().eq('user_id', userId);
  if (trades.length)
    await supabase.from('trades').insert(
      trades.map((t) => ({
        id: t.id,
        user_id: userId,
        date: t.date,
        pnl: t.pnl,
        symbol: t.symbol,
        setup: t.setup,
        mood: t.mood,
      }))
    );
}

export async function saveSaasProjects(userId, saasProjects) {
  if (!supabase || !userId) return;
  await supabase.from('saas_projects').delete().eq('user_id', userId);
  if (saasProjects.length)
    await supabase.from('saas_projects').insert(
      saasProjects.map((p) => ({
        id: p.id,
        user_id: userId,
        name: p.name,
        status: p.status,
        mrr: p.mrr,
        tasks: p.tasks,
        completed: p.completed,
      }))
    );
}

export async function saveVisionMilestones(userId, visionMilestones) {
  if (!supabase || !userId) return;
  await supabase.from('vision_milestones').delete().eq('user_id', userId);
  if (visionMilestones.length)
    await supabase.from('vision_milestones').insert(
      visionMilestones.map((m) => ({
        id: m.id,
        user_id: userId,
        year: m.year,
        title: m.title,
        icon: m.icon,
        achieved: m.achieved,
      }))
    );
}

export async function saveDailyTasks(userId, dailyTasks) {
  if (!supabase || !userId) return;
  await supabase.from('daily_tasks').delete().eq('user_id', userId);
  if (dailyTasks.length)
    await supabase.from('daily_tasks').insert(
      dailyTasks.map((t) => ({
        id: t.id,
        user_id: userId,
        label: t.label,
        xp: t.xp,
        completed: t.completed,
      }))
    );
}

export async function saveUserProfile(userId, xp, level, displayName = '') {
  if (!supabase || !userId) return;
  await supabase.from('user_profile').upsert(
    { user_id: userId, xp, level, display_name: displayName || '', updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
}
