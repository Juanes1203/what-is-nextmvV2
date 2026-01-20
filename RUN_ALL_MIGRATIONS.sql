-- ============================================
-- COMPLETE DATABASE MIGRATION SCRIPT
-- Run this in Supabase SQL Editor to set up your database
-- ============================================

-- ============================================
-- Migration 1: Create base tables
-- ============================================

-- Create pickup_points table
CREATE TABLE IF NOT EXISTS public.pickup_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 100,
  max_distance NUMERIC(10, 2),
  start_location JSONB,
  end_location JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create routes table to store optimization results
CREATE TABLE IF NOT EXISTS public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  route_data JSONB NOT NULL,
  total_distance NUMERIC(10, 2),
  total_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (making tables public for now as this is a logistics dashboard)
ALTER TABLE public.pickup_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Create public access policies for pickup_points
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'pickup_points' AND policyname = 'Allow public read access to pickup_points'
  ) THEN
    CREATE POLICY "Allow public read access to pickup_points"
      ON public.pickup_points FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'pickup_points' AND policyname = 'Allow public insert to pickup_points'
  ) THEN
    CREATE POLICY "Allow public insert to pickup_points"
      ON public.pickup_points FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'pickup_points' AND policyname = 'Allow public update to pickup_points'
  ) THEN
    CREATE POLICY "Allow public update to pickup_points"
      ON public.pickup_points FOR UPDATE
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'pickup_points' AND policyname = 'Allow public delete from pickup_points'
  ) THEN
    CREATE POLICY "Allow public delete from pickup_points"
      ON public.pickup_points FOR DELETE
      USING (true);
  END IF;
END $$;

-- Create public access policies for vehicles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicles' AND policyname = 'Allow public read access to vehicles'
  ) THEN
    CREATE POLICY "Allow public read access to vehicles"
      ON public.vehicles FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicles' AND policyname = 'Allow public insert to vehicles'
  ) THEN
    CREATE POLICY "Allow public insert to vehicles"
      ON public.vehicles FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicles' AND policyname = 'Allow public update to vehicles'
  ) THEN
    CREATE POLICY "Allow public update to vehicles"
      ON public.vehicles FOR UPDATE
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicles' AND policyname = 'Allow public delete from vehicles'
  ) THEN
    CREATE POLICY "Allow public delete from vehicles"
      ON public.vehicles FOR DELETE
      USING (true);
  END IF;
END $$;

-- Create public access policies for routes
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'routes' AND policyname = 'Allow public read access to routes'
  ) THEN
    CREATE POLICY "Allow public read access to routes"
      ON public.routes FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'routes' AND policyname = 'Allow public insert to routes'
  ) THEN
    CREATE POLICY "Allow public insert to routes"
      ON public.routes FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Create function for updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_pickup_points_updated_at ON public.pickup_points;
CREATE TRIGGER update_pickup_points_updated_at
  BEFORE UPDATE ON public.pickup_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Migration 2: Add quantity column
-- ============================================

-- Add quantity column to pickup_points table
ALTER TABLE public.pickup_points
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Update existing records to have quantity = 1 if null
UPDATE public.pickup_points
SET quantity = 1
WHERE quantity IS NULL;

-- ============================================
-- Migration 3: Add grupo column
-- ============================================

-- Add grupo column to vehicles table
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS grupo TEXT;

-- Add grupo column to pickup_points table if it doesn't exist
ALTER TABLE public.pickup_points 
ADD COLUMN IF NOT EXISTS grupo TEXT;

-- ============================================
-- Migration 4: Add grupo and optimization_run_id to routes
-- ============================================

-- Add grupo column to routes table
ALTER TABLE public.routes 
ADD COLUMN IF NOT EXISTS grupo TEXT;

-- Add optimization_run_id to group routes from the same optimization run
-- All routes created in the same optimization run (even across different groups) will have the same run_id
ALTER TABLE public.routes 
ADD COLUMN IF NOT EXISTS optimization_run_id UUID;

-- Add nextmv_run_ids to store the Nextmv API run IDs associated with this optimization
-- This allows linking Nextmv runs to Supabase routes
ALTER TABLE public.routes 
ADD COLUMN IF NOT EXISTS nextmv_run_ids TEXT[];

-- Create indexes for faster queries by grupo and optimization_run_id
CREATE INDEX IF NOT EXISTS idx_routes_grupo ON public.routes(grupo);
CREATE INDEX IF NOT EXISTS idx_routes_optimization_run_id ON public.routes(optimization_run_id);
CREATE INDEX IF NOT EXISTS idx_routes_created_at ON public.routes(created_at DESC);

-- Create GIN index for array searches on nextmv_run_ids
CREATE INDEX IF NOT EXISTS idx_routes_nextmv_run_ids ON public.routes USING GIN(nextmv_run_ids);

-- ============================================
-- Migration 5: Add person_id and optimization_run_id to pickup_points
-- ============================================

-- Add person_id column to pickup_points table
-- This stores passenger IDs related to each point (can be comma-separated for multiple passengers)
ALTER TABLE public.pickup_points 
ADD COLUMN IF NOT EXISTS person_id TEXT;

-- Add optimization_run_id to link points to specific optimization runs
-- This allows loading the exact points used in a previously executed optimization
ALTER TABLE public.pickup_points 
ADD COLUMN IF NOT EXISTS optimization_run_id UUID;

-- Create index for faster queries by optimization_run_id
CREATE INDEX IF NOT EXISTS idx_pickup_points_optimization_run_id ON public.pickup_points(optimization_run_id);

-- ============================================
-- Migration 6: Add stop_id to pickup_points
-- ============================================

-- Add stop_id column to pickup_points table
-- This stores the stop_id from Nextmv optimization response, allowing us to link
-- route stops back to the exact pickup_point records with their passenger IDs
ALTER TABLE public.pickup_points 
ADD COLUMN IF NOT EXISTS stop_id TEXT;

-- Create index for faster queries by stop_id
CREATE INDEX IF NOT EXISTS idx_pickup_points_stop_id ON public.pickup_points(stop_id);

-- ============================================
-- Migration complete!
-- ============================================
