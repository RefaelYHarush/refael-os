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

  const lifeResults = await Promise.allSettled([
    supabase.from('health_entries').select('*').eq('user_id', userId).order('date', { ascending: false }).order('id', { ascending: false }),
    supabase.from('learning_items').select('*').eq('user_id', userId).order('id', { ascending: true }),
    supabase.from('finance_goals').select('*').eq('user_id', userId).order('id', { ascending: true }),
    supabase.from('relationships').select('*').eq('user_id', userId).order('id', { ascending: true }),
  ]);
  const healthRes = lifeResults[0].status === 'fulfilled' ? lifeResults[0].value : null;
  const learningRes = lifeResults[1].status === 'fulfilled' ? lifeResults[1].value : null;
  const financeRes = lifeResults[2].status === 'fulfilled' ? lifeResults[2].value : null;
  const relationshipsRes = lifeResults[3].status === 'fulfilled' ? lifeResults[3].value : null;

  const hasTrades = tradesRes.data?.length > 0;
  const hasSaas = saasRes.data?.length > 0;
  const hasVision = visionRes.data?.length > 0;
  const hasTasks = tasksRes.data?.length > 0;

  if (!hasTrades && !hasSaas && !hasVision && !hasTasks) {
    await seedDefaults(userId);
    return loadAll(userId);
  }

  const profile = profileRes.data || { xp: INITIAL_XP, level: INITIAL_LEVEL, display_name: '' };
  const calendarEmbedUrl = profile.calendar_embed_url ?? '';
  const selectedCalendarId = profile.selected_calendar_id ?? 'primary';
  const rawCategories = profile.enabled_categories;
  const enabledCategories = Array.isArray(rawCategories) && rawCategories.length > 0
    ? rawCategories
    : undefined;

  const healthEntries = (healthRes?.data || []).map((r) => ({
    id: r.id,
    date: r.date,
    type: r.type,
    value: Number(r.value),
    note: r.note || '',
  }));
  const learningItems = (learningRes?.data || []).map((r) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    status: r.status,
    progress: Number(r.progress) ?? 0,
    note: r.note || '',
  }));
  const financeGoals = (financeRes?.data || []).map((r) => ({
    id: r.id,
    name: r.name,
    targetAmount: Number(r.target_amount),
    currentAmount: Number(r.current_amount),
    deadline: r.deadline || '',
  }));
  const relationshipItems = (relationshipsRes?.data || []).map((r) => ({
    id: r.id,
    name: r.name,
    lastContact: r.last_contact || '',
    note: r.note || '',
  }));

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
    calendarEmbedUrl,
    selectedCalendarId,
    enabledCategories,
    healthEntries,
    learningItems,
    financeGoals,
    relationshipItems,
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
      { user_id: userId, xp: INITIAL_XP, level: INITIAL_LEVEL, display_name: '', enabled_categories: ['dashboard', 'trading', 'saas', 'vision'], updated_at: new Date().toISOString() },
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

export async function saveUserProfile(userId, xp, level, displayName = '', enabledCategories = null) {
  if (!supabase || !userId) return;
  const row = {
    user_id: userId,
    xp,
    level,
    display_name: displayName || '',
    updated_at: new Date().toISOString(),
  };
  if (Array.isArray(enabledCategories) && enabledCategories.length > 0) {
    row.enabled_categories = enabledCategories;
  }
  await supabase.from('user_profile').upsert(row, { onConflict: 'user_id' });
}

/** עדכון שדות יומן גוגל (הרץ קודם SUPABASE_MIGRATION_CALENDAR_PROFILE.sql) */
export async function saveCalendarProfile(userId, calendarEmbedUrl, selectedCalendarId) {
  if (!supabase || !userId) return;
  const updates = { updated_at: new Date().toISOString() };
  if (calendarEmbedUrl !== undefined) updates.calendar_embed_url = calendarEmbedUrl || null;
  if (selectedCalendarId !== undefined) updates.selected_calendar_id = selectedCalendarId || 'primary';
  await supabase.from('user_profile').update(updates).eq('user_id', userId);
}

export async function saveHealthEntries(userId, healthEntries) {
  if (!supabase || !userId) return;
  await supabase.from('health_entries').delete().eq('user_id', userId);
  if (healthEntries.length)
    await supabase.from('health_entries').insert(
      healthEntries.map((e) => ({
        id: e.id,
        user_id: userId,
        date: e.date,
        type: e.type,
        value: e.value,
        note: e.note || '',
      }))
    );
}

export async function saveLearningItems(userId, learningItems) {
  if (!supabase || !userId) return;
  await supabase.from('learning_items').delete().eq('user_id', userId);
  if (learningItems.length)
    await supabase.from('learning_items').insert(
      learningItems.map((i) => ({
        id: i.id,
        user_id: userId,
        title: i.title,
        type: i.type,
        status: i.status,
        progress: i.progress ?? 0,
        note: i.note || '',
      }))
    );
}

export async function saveFinanceGoals(userId, financeGoals) {
  if (!supabase || !userId) return;
  await supabase.from('finance_goals').delete().eq('user_id', userId);
  if (financeGoals.length)
    await supabase.from('finance_goals').insert(
      financeGoals.map((g) => ({
        id: g.id,
        user_id: userId,
        name: g.name,
        target_amount: g.targetAmount,
        current_amount: g.currentAmount,
        deadline: g.deadline || '',
      }))
    );
}

export async function saveRelationships(userId, relationshipItems) {
  if (!supabase || !userId) return;
  await supabase.from('relationships').delete().eq('user_id', userId);
  if (relationshipItems.length)
    await supabase.from('relationships').insert(
      relationshipItems.map((r) => ({
        id: r.id,
        user_id: userId,
        name: r.name,
        last_contact: r.lastContact || null,
        note: r.note || '',
      }))
    );
}
