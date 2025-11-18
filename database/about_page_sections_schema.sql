-- Database Schema for About Page New Sections
-- Run this SQL in your Supabase SQL Editor

-- About page sections content
CREATE TABLE IF NOT EXISTS about_page_sections (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About page images
CREATE TABLE IF NOT EXISTS about_page_images (
  id BIGSERIAL PRIMARY KEY,
  section_key TEXT NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  "order" INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EdVenture Park metrics
CREATE TABLE IF NOT EXISTS edventure_park_metrics (
  id BIGSERIAL PRIMARY KEY,
  icon TEXT,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  "order" INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS about_testimonials (
  id BIGSERIAL PRIMARY KEY,
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_title TEXT NOT NULL,
  author_image_url TEXT,
  gradient_color TEXT,
  "order" INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Impact stats
CREATE TABLE IF NOT EXISTS about_impact_stats (
  id BIGSERIAL PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  "order" INT DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default values
INSERT INTO about_page_sections (key, value) VALUES
  ('why_we_do_this_title', 'Why We Do This'),
  ('why_we_do_this_content', 'We believe that the person standing next to you at a coffee stall might just be your future co-founder. We believe that one conversation can unlock the door you''ve been banging on for months.'),
  ('proof_title', 'The Proof is in the People (2023 & 2024)'),
  ('join_next_chapter_title', 'Join Us for the Next Chapter'),
  ('join_next_chapter_date', 'Dec 31st, 2025 & Jan 1st, 2026'),
  ('join_next_chapter_venue', 'Public Gardens, Nampally, Hyderabad.'),
  ('join_next_chapter_content', 'Don''t just watch Hyderabad grow. Be the reason it grows.'),
  ('what_happens_title', 'What Actually Happens at Founders'' Fest?'),
  ('main_festival_title', 'The Main Festival (Dec 31, 2025 - Jan 1, 2026)'),
  ('main_festival_intro', 'We are taking over at the end of the year. Why? Because what better way to ring in a new year than by betting on yourself?'),
  ('the_market_title', 'The Market'),
  ('the_market_content', 'Walk through hundreds of stalls where founders are showcasing everything from tech solutions to handmade goods.'),
  ('the_stage_title', 'The Stage'),
  ('the_stage_content', 'Honest conversations. We ask our speakers to leave the "success porn" at home and talk about the failures, the pivots, and the real strategies that worked.'),
  ('mentors_lounge_title', 'The Mentors'' Lounge'),
  ('mentors_lounge_content', 'This is where the magic happens. Sit down with veterans who have been there, done that, and get honest feedback on your roadmap.'),
  ('looking_back_title', 'Looking Back (2023 & 2024)'),
  ('looking_back_content', 'If you missed the last two years, you missed a vibe. We had over 100 influencers amplifying local brands. We had 11 startups walk away with awards that put them on the map. But mostly, we had 50,000 people realizing that entrepreneurship doesn''t have to be a solo sport.'),
  ('participate_cta_text', 'Participate Now'),
  ('participate_cta_note', 'Early bird opens soon!')
ON CONFLICT (key) DO NOTHING;

-- Insert default EdVenture Park metrics
INSERT INTO edventure_park_metrics (icon, value, label, "order", visible) VALUES
  ('rocket', '300+', 'Startups', 0, true),
  ('graduation', '700+', 'Student Founders', 1, true),
  ('briefcase', '300+', 'Jobs Created', 2, true)
ON CONFLICT DO NOTHING;

-- Insert default testimonials
INSERT INTO about_testimonials (quote, author_name, author_title, author_image_url, gradient_color, "order", visible) VALUES
  ('An unparalleled experience. The connections I made were game-changing for my startup.', 'Alex Chen', 'CEO of InnovateX', '', 'blue-green', 0, true),
  ('The energy is electric! It''s not just an event; it''s a family of innovators.', 'Samantha Bee', 'Founder of ConnectHub', '', 'pink-orange', 1, true)
ON CONFLICT DO NOTHING;

-- Insert default impact stats
INSERT INTO about_impact_stats (value, label, "order", visible) VALUES
  ('400+', 'Businesses didn''t just show up; they set up shop and sold their vision.', 0, true),
  ('50,000+', 'People walked through our doors, creating an energy you could feel in your bones.', 1, true),
  ('₹3.2 Crore', 'changed hands right on the floor—because passion is great, but revenue is validation.', 2, true)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE about_page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE edventure_park_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_impact_stats ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "about_page_sections_select_public"
ON about_page_sections FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "about_page_images_select_public"
ON about_page_images FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "edventure_park_metrics_select_public"
ON edventure_park_metrics FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "about_testimonials_select_public"
ON about_testimonials FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "about_impact_stats_select_public"
ON about_impact_stats FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can manage
CREATE POLICY "about_page_sections_manage_admins"
ON about_page_sections FOR ALL
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

CREATE POLICY "about_page_images_manage_admins"
ON about_page_images FOR ALL
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

CREATE POLICY "edventure_park_metrics_manage_admins"
ON edventure_park_metrics FOR ALL
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

CREATE POLICY "about_testimonials_manage_admins"
ON about_testimonials FOR ALL
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

CREATE POLICY "about_impact_stats_manage_admins"
ON about_impact_stats FOR ALL
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
CREATE INDEX IF NOT EXISTS idx_about_page_sections_key ON about_page_sections(key);
CREATE INDEX IF NOT EXISTS idx_about_page_images_section ON about_page_images(section_key, "order");
CREATE INDEX IF NOT EXISTS idx_edventure_park_metrics_order ON edventure_park_metrics("order");
CREATE INDEX IF NOT EXISTS idx_about_testimonials_order ON about_testimonials("order");
CREATE INDEX IF NOT EXISTS idx_about_impact_stats_order ON about_impact_stats("order");

