-- Add grupo column and optimization_run_id to routes table
-- This allows grouping routes from the same optimization run, even across different groups

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

-- Create index for faster queries by grupo and optimization_run_id
CREATE INDEX IF NOT EXISTS idx_routes_grupo ON public.routes(grupo);
CREATE INDEX IF NOT EXISTS idx_routes_optimization_run_id ON public.routes(optimization_run_id);
CREATE INDEX IF NOT EXISTS idx_routes_created_at ON public.routes(created_at DESC);

-- Create GIN index for array searches on nextmv_run_ids
CREATE INDEX IF NOT EXISTS idx_routes_nextmv_run_ids ON public.routes USING GIN(nextmv_run_ids);
