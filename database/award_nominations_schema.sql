-- Database Schema for Award Nominations
-- Run this SQL in your Supabase SQL Editor

-- Create the award_nominations table
CREATE TABLE IF NOT EXISTS award_nominations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  founder TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  category TEXT NOT NULL,
  about TEXT NOT NULL,
  unique_value TEXT NOT NULL,
  milestones TEXT NOT NULL,
  challenges TEXT NOT NULL,
  why TEXT NOT NULL,
  logo_url TEXT,
  founder_image_url TEXT,
  product_image_url TEXT,
  video_url TEXT,
  payment_number TEXT,
  payment_screenshot_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_award_nominations_email ON award_nominations(email);
CREATE INDEX IF NOT EXISTS idx_award_nominations_category ON award_nominations(category);
CREATE INDEX IF NOT EXISTS idx_award_nominations_status ON award_nominations(status);
CREATE INDEX IF NOT EXISTS idx_award_nominations_created_at ON award_nominations(created_at DESC);

-- Enable RLS
ALTER TABLE award_nominations ENABLE ROW LEVEL SECURITY;

-- Public can insert nominations
CREATE POLICY "award_nominations_insert_public"
ON award_nominations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read, update, delete nominations
CREATE POLICY "award_nominations_select_admins"
ON award_nominations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  )
);

CREATE POLICY "award_nominations_update_admins"
ON award_nominations FOR UPDATE
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

CREATE POLICY "award_nominations_delete_admins"
ON award_nominations FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  )
);

-- Create storage bucket for award nominations
INSERT INTO storage.buckets (id, name, public)
VALUES ('award-nominations', 'award-nominations', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for award-nominations bucket
-- Allow public uploads (for form submissions)
CREATE POLICY "Allow public uploads for award nominations"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'award-nominations');

-- Allow public reads
CREATE POLICY "Allow public reads for award nominations"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'award-nominations');

-- Only admins can delete files
CREATE POLICY "Allow admin deletes for award nominations"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'award-nominations' AND
  EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  )
);

