-- Add stop_id column to pickup_points table
-- This stores the stop_id from Nextmv optimization response, allowing us to link
-- route stops back to the exact pickup_point records with their passenger IDs
ALTER TABLE public.pickup_points 
ADD COLUMN IF NOT EXISTS stop_id TEXT;

-- Create index for faster queries by stop_id
CREATE INDEX IF NOT EXISTS idx_pickup_points_stop_id ON public.pickup_points(stop_id);
