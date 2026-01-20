-- Run this SQL in your Supabase SQL Editor to add the grupo column
-- Go to: Supabase Dashboard > SQL Editor > New Query > Paste this > Run
-- OR execute this migration programmatically through the app

-- Add grupo column to vehicles table
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS grupo TEXT;

-- Add grupo column to pickup_points table if it doesn't exist
ALTER TABLE public.pickup_points 
ADD COLUMN IF NOT EXISTS grupo TEXT;
