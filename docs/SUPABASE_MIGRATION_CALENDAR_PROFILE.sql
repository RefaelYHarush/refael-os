-- הוסף שדות יומן גוגל לפרופיל המשתמש
-- הרץ ב-Supabase: SQL Editor או via Supabase CLI migration

ALTER TABLE public.user_profile
  ADD COLUMN IF NOT EXISTS calendar_embed_url text,
  ADD COLUMN IF NOT EXISTS selected_calendar_id text;

COMMENT ON COLUMN public.user_profile.calendar_embed_url IS 'קישור להטמעת יומן גוגל (iframe src)';
COMMENT ON COLUMN public.user_profile.selected_calendar_id IS 'מזהה יומן גוגל להצגת אירועים (למשל primary)';
