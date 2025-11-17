-- Migration: Add status column to existing stall_bookings table
-- Run this SQL in your Supabase SQL Editor if you already have the stall_bookings table

-- Add status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stall_bookings' AND column_name = 'status'
  ) THEN
    ALTER TABLE stall_bookings 
    ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Update existing records to have 'pending' status if they're null
UPDATE stall_bookings SET status = 'pending' WHERE status IS NULL;

-- Create update policy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'stall_bookings' 
    AND policyname = 'Allow authenticated updates'
  ) THEN
    CREATE POLICY "Allow authenticated updates" ON stall_bookings
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

