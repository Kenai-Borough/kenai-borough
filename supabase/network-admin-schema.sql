-- Network admin tables
CREATE TABLE IF NOT EXISTS network_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES kenai_profiles(id),
  target_type TEXT,
  target_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS network_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site TEXT NOT NULL,
  reporter_id UUID REFERENCES kenai_profiles(id),
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending',
  resolved_by UUID REFERENCES kenai_profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS network_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sites TEXT[] DEFAULT ARRAY['all'],
  type TEXT DEFAULT 'info',
  active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  created_by UUID REFERENCES kenai_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS network_site_config (
  site TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  display_name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  maintenance_message TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO network_site_config (site, domain, display_name)
VALUES
  ('borough', 'kenaiborough.com', 'Kenai Borough'),
  ('realty', 'kenaiboroughrealty.com', 'Kenai Borough Realty'),
  ('land', 'kenailandsales.com', 'Kenai Land Sales'),
  ('rentals', 'kenaipeninsularentals.com', 'Kenai Peninsula Rentals'),
  ('homes', 'kenaihomesales.com', 'Kenai Home Sales'),
  ('auto', 'kenaiautosales.com', 'Kenai Auto Sales')
ON CONFLICT (site) DO UPDATE
SET
  domain = EXCLUDED.domain,
  display_name = EXCLUDED.display_name,
  updated_at = NOW();

CREATE INDEX IF NOT EXISTS idx_activity_log_site ON network_activity_log(site);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON network_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status ON network_reports(status);
