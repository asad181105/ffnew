-- Database Schema for Home Page Interactive Selector Section
-- Run this SQL in your Supabase SQL Editor

-- Table for Interactive Selector options
CREATE TABLE IF NOT EXISTS home_interactive_selector_options (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  icon_name TEXT, -- e.g., 'ShoppingBag', 'Mic', 'Users', 'Award', 'Network'
  "order" INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for Interactive Selector section settings
CREATE TABLE IF NOT EXISTS home_interactive_selector_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO home_interactive_selector_settings (key, value) VALUES
  ('title', 'Experience Founders Fest'),
  ('subtitle', 'Discover what makes Founders Fest the ultimate gathering for entrepreneurs, innovators, and dreamers.')
ON CONFLICT (key) DO NOTHING;

-- Insert default options
INSERT INTO home_interactive_selector_options (title, description, image_url, icon_name, "order", visible) VALUES
  ('The Market', 'Hundreds of stalls showcasing innovation', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80', 'ShoppingBag', 0, true),
  ('The Stage', 'Honest conversations from industry leaders', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', 'Mic', 1, true),
  ('Mentors'' Lounge', 'One-on-one sessions with veterans', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80', 'Users', 2, true),
  ('Awards & Recognition', 'Celebrate outstanding achievements', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80', 'Award', 3, true),
  ('Networking', 'Connect with founders and investors', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80', 'Network', 4, true)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE home_interactive_selector_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_interactive_selector_settings ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "home_interactive_selector_options_select_public"
ON home_interactive_selector_options FOR SELECT
TO anon, authenticated
USING (visible = true);

CREATE POLICY "home_interactive_selector_settings_select_public"
ON home_interactive_selector_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can manage
CREATE POLICY "home_interactive_selector_options_manage_admins"
ON home_interactive_selector_options FOR ALL
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

CREATE POLICY "home_interactive_selector_settings_manage_admins"
ON home_interactive_selector_settings FOR ALL
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
CREATE INDEX IF NOT EXISTS idx_home_interactive_selector_options_order ON home_interactive_selector_options("order" ASC);
CREATE INDEX IF NOT EXISTS idx_home_interactive_selector_settings_key ON home_interactive_selector_settings(key);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_home_interactive_selector_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_home_interactive_selector_options_updated_at
  BEFORE UPDATE ON home_interactive_selector_options
  FOR EACH ROW
  EXECUTE FUNCTION update_home_interactive_selector_updated_at();

CREATE TRIGGER update_home_interactive_selector_settings_updated_at
  BEFORE UPDATE ON home_interactive_selector_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_home_interactive_selector_updated_at();

