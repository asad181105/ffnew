-- Database Schema for Contact Page Content
-- Run this SQL in your Supabase SQL Editor

-- Contact page sections content
CREATE TABLE IF NOT EXISTS contact_page_content (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default values
INSERT INTO contact_page_content (key, value) VALUES
  ('section_title', 'We Actually Read Our Emails.'),
  ('section_subtitle', 'Got a question, a brilliant idea, or just want to say hi? You''re in the right place.'),
  ('email_general', 'yo@foundersfest.com'),
  ('email_partnerships', 'partners@foundersfest.com'),
  ('email_academic', 'uni@foundersfest.com'),
  ('email_stalls', 'stalls@foundersfest.com'),
  ('social_instagram', 'https://instagram.com/foundersfest'),
  ('social_twitter', 'https://twitter.com/foundersfest'),
  ('social_linkedin', 'https://linkedin.com/company/edventurepark'),
  ('team_note', 'We''re a small, passionate crew. We''ll get back to you as soon as we can, usually within 48 funky hours. Thanks for your patience!')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE contact_page_content ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "contact_page_content_select_public"
ON contact_page_content FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can manage
CREATE POLICY "contact_page_content_manage_admins"
ON contact_page_content FOR ALL
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
CREATE INDEX IF NOT EXISTS idx_contact_page_content_key ON contact_page_content(key);

