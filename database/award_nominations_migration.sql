-- Migration: Update award_nominations table for file uploads
-- Run this SQL in your Supabase SQL Editor if you already have the award_nominations table

-- Add status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'award_nominations' AND column_name = 'status'
  ) THEN
    ALTER TABLE award_nominations 
    ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Rename 'unique' column to 'unique_value' if it exists (unique is a reserved keyword)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'award_nominations' AND column_name = 'unique'
  ) THEN
    ALTER TABLE award_nominations 
    RENAME COLUMN "unique" TO unique_value;
  END IF;
END $$;

-- Create storage bucket for award nominations if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('award-nominations', 'award-nominations', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for award-nominations bucket (if they don't exist)
DO $$
BEGIN
  -- Allow public uploads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow public uploads for award nominations'
  ) THEN
    CREATE POLICY "Allow public uploads for award nominations"
    ON storage.objects FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'award-nominations');
  END IF;

  -- Allow public reads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow public reads for award nominations'
  ) THEN
    CREATE POLICY "Allow public reads for award nominations"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'award-nominations');
  END IF;

  -- Allow admin deletes
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow admin deletes for award nominations'
  ) THEN
    CREATE POLICY "Allow admin deletes for award nominations"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'award-nominations' AND
      EXISTS (
        SELECT 1 FROM admins WHERE user_id = auth.uid()
      )
    );
  END IF;
END $$;

