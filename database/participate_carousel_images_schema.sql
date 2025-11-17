-- Database Schema for Participate Page Carousel Images
-- Run this SQL in your Supabase SQL Editor

-- Create the participate_carousel_images table
CREATE TABLE IF NOT EXISTS participate_carousel_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on order for faster sorting
CREATE INDEX IF NOT EXISTS idx_carousel_images_order ON participate_carousel_images(order ASC);

-- Enable Row Level Security (RLS)
ALTER TABLE participate_carousel_images ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public reads
CREATE POLICY "Allow public reads" ON participate_carousel_images
  FOR SELECT
  TO anon, authenticated
  USING (visible = true);

-- Create a policy to allow authenticated users to insert/update/delete (admin access)
CREATE POLICY "Allow authenticated writes" ON participate_carousel_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_carousel_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_carousel_images_updated_at
  BEFORE UPDATE ON participate_carousel_images
  FOR EACH ROW
  EXECUTE FUNCTION update_carousel_images_updated_at();

-- Example: Insert some placeholder images (optional)
-- You can replace these with your actual image URLs
-- INSERT INTO participate_carousel_images (url, "order", visible) VALUES
--   ('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', 0, true),
--   ('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop', 1, true),
--   ('https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop', 2, true),
--   ('https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop', 3, true);

