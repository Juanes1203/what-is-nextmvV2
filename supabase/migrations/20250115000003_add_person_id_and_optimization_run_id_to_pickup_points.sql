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
