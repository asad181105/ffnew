-- Database Schema for Awards Page Content
-- Run this SQL in your Supabase SQL Editor

-- Awards page hero section
CREATE TABLE IF NOT EXISTS awards_page_content (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Awards spotlight benefits
CREATE TABLE IF NOT EXISTS awards_spotlight_benefits (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Awards nomination process steps
CREATE TABLE IF NOT EXISTS awards_nomination_steps (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default values for awards_page_content
INSERT INTO awards_page_content (key, value) VALUES
  ('hero_title', 'Show the World What You''ve Built.'),
  ('hero_cta_text', 'Nominate Your Startup!'),
  ('spotlight_title', 'Why Put Your Startup in the Spotlight?'),
  ('past_winners_callout', 'Join the ranks of past winners like Aura Health & FinTech Wave.'),
  ('nominate_title', 'Ready to Nominate?'),
  ('nominate_subtitle', 'Share your vision. Claim your spot.'),
  ('nomination_deadline', 'October 31, 2024'),
  ('what_happens_title', 'What Happens Next?')
ON CONFLICT (key) DO NOTHING;

-- Insert default spotlight benefits
INSERT INTO awards_spotlight_benefits (title, description, "order", visible) VALUES
  ('Recognition', 'Gain industry-wide acclaim and media attention.', 0, true),
  ('Credibility', 'Earn a powerful seal of approval from experts.', 1, true),
  ('Amplification', 'Reach new partners and investors.', 2, true),
  ('Inspiration', 'Motivate the next wave of founders.', 3, true)
ON CONFLICT DO NOTHING;

-- Insert default nomination steps
INSERT INTO awards_nomination_steps (title, description, "order", visible) VALUES
  ('Initial Screening', 'Our team reviews all nominations for eligibility.', 0, true),
  ('Judging Panel', 'Finalists are reviewed by a panel of industry experts.', 1, true),
  ('Winners Announcement', 'Winners are revealed live at Founders Fest!', 2, true)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE awards_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards_spotlight_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards_nomination_steps ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "awards_page_content_select_public"
ON awards_page_content FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "awards_spotlight_benefits_select_public"
ON awards_spotlight_benefits FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "awards_nomination_steps_select_public"
ON awards_nomination_steps FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can manage
CREATE POLICY "awards_page_content_manage_admins"
ON awards_page_content FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  )
);

CREATE POLICY "awards_spotlight_benefits_manage_admins"
ON awards_spotlight_benefits FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  )
);

CREATE POLICY "awards_nomination_steps_manage_admins"
ON awards_nomination_steps FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_awards_page_content_key ON awards_page_content(key);
CREATE INDEX IF NOT EXISTS idx_awards_spotlight_benefits_order ON awards_spotlight_benefits("order");
CREATE INDEX IF NOT EXISTS idx_awards_nomination_steps_order ON awards_nomination_steps("order");

