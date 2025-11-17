-- Database Schema for Stall Bookings
-- Run this SQL in your Supabase SQL Editor

-- Create the stall_bookings table
CREATE TABLE IF NOT EXISTS stall_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  startup_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  category TEXT NOT NULL,
  business_description TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT NOT NULL,
  social_media_handle TEXT NOT NULL,
  stall_type TEXT NOT NULL,
  payment_screenshot_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_stall_bookings_email ON stall_bookings(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_stall_bookings_created_at ON stall_bookings(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE stall_bookings ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts (public can submit forms)
CREATE POLICY "Allow public inserts" ON stall_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create a policy to allow authenticated users to read (admin access)
CREATE POLICY "Allow authenticated reads" ON stall_bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a policy to allow authenticated users to update (admin access)
CREATE POLICY "Allow authenticated updates" ON stall_bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for stall bookings files
INSERT INTO storage.buckets (id, name, public)
VALUES ('stall-bookings', 'stall-bookings', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the bucket
-- Allow public uploads
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'stall-bookings');

-- Allow public reads
CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'stall-bookings');

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_stall_bookings_updated_at
  BEFORE UPDATE ON stall_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

