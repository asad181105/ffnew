-- Database Schema for Home Page Content
-- Run this SQL in your Supabase SQL Editor

-- Home page content
CREATE TABLE IF NOT EXISTS home_page_content (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default values
INSERT INTO home_page_content (key, value) VALUES
  ('section1_headline', 'For the dreamers who dare and the doers who deliver'),
  ('section1_subheadline', 'Hyderabad is building something big. Are you in?'),
  ('section1_content', 'Let''s be honest: building a business is lonely work. You have the vision, but you also have the late nights, the doubts, and the grind. Founders'' Fest isn''t just another conference with people in suits talking to you. It''s a gathering of the people who are actually in the arena.'),
  ('section1_content_2', 'This is where Hyderabad''s hustle finds a home. Whether you are coding your MVP in a cafe in Hitech City, running a small business from your living room, or looking to scale your startup to the moon, you belong here.')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE home_page_content ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "home_page_content_select_public"
ON home_page_content FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can manage
CREATE POLICY "home_page_content_manage_admins"
ON home_page_content FOR ALL
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

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_home_page_content_key ON home_page_content(key);

