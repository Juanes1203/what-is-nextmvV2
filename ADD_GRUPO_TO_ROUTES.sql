-- Add grupo column and related columns to routes table
-- Run this in Supabase SQL Editor

-- Add grupo column to routes table
ALTER TABLE public.routes 
ADD COLUMN IF NOT EXISTS grupo TEXT;

-- Add optimization_run_id to group routes from the same optimization run
ALTER TABLE public.routes 
ADD COLUMN IF NOT EXISTS optimization_run_id UUID;

-- Add nextmv_run_ids to store the Nextmv API run IDs associated with this optimization
ALTER TABLE public.routes 
ADD COLUMN IF NOT EXISTS nextmv_run_ids TEXT[];

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_routes_grupo ON public.routes(grupo);
CREATE INDEX IF NOT EXISTS idx_routes_optimization_run_id ON public.routes(optimization_run_id);
CREATE INDEX IF NOT EXISTS idx_routes_nextmv_run_ids ON public.routes USING GIN(nextmv_run_ids);

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'routes' 
  AND column_name IN ('grupo', 'optimization_run_id', 'nextmv_run_ids')
ORDER BY column_name;
