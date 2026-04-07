-- ══════════════════════════════════════════
-- NEXUS DATABASE SCHEMA
-- Run in Supabase → SQL Editor
-- ══════════════════════════════════════════

-- ── Sessions (anonymous user tracking) ──
CREATE TABLE IF NOT EXISTS sessions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fingerprint   TEXT NOT NULL UNIQUE,
  language      TEXT DEFAULT 'en',
  device        TEXT DEFAULT 'desktop',
  theme         TEXT DEFAULT 'dark-glass',
  country       TEXT,
  first_seen    TIMESTAMPTZ DEFAULT NOW(),
  last_seen     TIMESTAMPTZ DEFAULT NOW(),
  total_visits  INTEGER DEFAULT 1
);

-- ── Page views ──
CREATE TABLE IF NOT EXISTS page_views (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  page        TEXT NOT NULL,
  timestamp   TIMESTAMPTZ DEFAULT NOW(),
  duration_ms INTEGER
);

-- ── Journal entries ──
CREATE TABLE IF NOT EXISTS journal_entries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  title       TEXT,
  content     TEXT NOT NULL,
  mood        TEXT,
  tags        TEXT[],
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Health logs ──
CREATE TABLE IF NOT EXISTS health_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  date        DATE DEFAULT CURRENT_DATE,
  steps       INTEGER DEFAULT 0,
  water_ml    INTEGER DEFAULT 0,
  sleep_hrs   NUMERIC(4,1) DEFAULT 0,
  calories    INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Budget items ──
CREATE TABLE IF NOT EXISTS budget_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  type        TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  category    TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,
  note        TEXT,
  date        DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Habits ──
CREATE TABLE IF NOT EXISTS habits (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  name        TEXT NOT NULL,
  icon        TEXT,
  color       TEXT DEFAULT '#6c63ff',
  target_days INTEGER DEFAULT 7,
  streak      INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habit_completions (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id  UUID REFERENCES habits(id) ON DELETE CASCADE,
  date      DATE DEFAULT CURRENT_DATE,
  UNIQUE(habit_id, date)
);

-- ── Enable Row Level Security (public anonymous access) ──
ALTER TABLE sessions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views       ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits           ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- ── Policies: allow anon to read/write their own data by fingerprint ──
CREATE POLICY "anon_sessions"    ON sessions         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_page_views"  ON page_views       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_journal"     ON journal_entries  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_health"      ON health_logs      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_budget"      ON budget_items     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_habits"      ON habits           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_completions" ON habit_completions FOR ALL USING (true) WITH CHECK (true);

-- ── Indexes for performance ──
CREATE INDEX IF NOT EXISTS idx_sessions_fp         ON sessions(fingerprint);
CREATE INDEX IF NOT EXISTS idx_sessions_last_seen  ON sessions(last_seen);
CREATE INDEX IF NOT EXISTS idx_page_views_fp       ON page_views(fingerprint);
CREATE INDEX IF NOT EXISTS idx_page_views_ts       ON page_views(timestamp);
CREATE INDEX IF NOT EXISTS idx_journal_fp          ON journal_entries(fingerprint);
CREATE INDEX IF NOT EXISTS idx_health_fp_date      ON health_logs(fingerprint, date);
CREATE INDEX IF NOT EXISTS idx_budget_fp           ON budget_items(fingerprint);
CREATE INDEX IF NOT EXISTS idx_habits_fp           ON habits(fingerprint);
