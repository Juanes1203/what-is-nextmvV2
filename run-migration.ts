// Run this migration script to add grupo column to vehicles and pickup_points tables
// Execute: npx tsx run-migration.ts
// Or run the SQL directly in Supabase SQL Editor

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('VITE_SUPABASE_URL environment variable is required');
  process.exit(1);
}

// Note: For DDL operations like ALTER TABLE, you typically need admin/service role key
// If you don't have a service role key, run the SQL directly in Supabase SQL Editor
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.log('Service role key not found. Please run the SQL directly in Supabase SQL Editor:');
  console.log('\n--- SQL to run ---');
  console.log('ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS grupo TEXT;');
  console.log('ALTER TABLE public.pickup_points ADD COLUMN IF NOT EXISTS grupo TEXT;');
  console.log('------------------\n');
  console.log('Go to: Supabase Dashboard > SQL Editor > New Query > Paste the SQL above > Run');
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('Running migration to add grupo column...');
  
  try {
    // Execute the migration SQL using RPC (if you have a function) or direct SQL
    // Note: Supabase client doesn't directly support DDL operations
    // You'll need to use Supabase CLI or SQL Editor
    
    console.log('Migration SQL:');
    console.log('ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS grupo TEXT;');
    console.log('ALTER TABLE public.pickup_points ADD COLUMN IF NOT EXISTS grupo TEXT;');
    console.log('\n⚠️  DDL operations cannot be executed through the Supabase JS client.');
    console.log('Please run the SQL directly in Supabase SQL Editor:');
    console.log('Go to: Supabase Dashboard > SQL Editor > New Query > Paste SQL > Run');
    
    // Alternative: Check if columns already exist
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('grupo')
      .limit(1);
    
    if (!vehiclesError) {
      console.log('\n✅ Vehicles table is accessible and grupo column may already exist');
    } else if (vehiclesError.code === '42703') {
      console.log('\n⚠️  grupo column does not exist yet. Please run the migration SQL.');
    } else {
      console.log('\nError checking vehicles table:', vehiclesError.message);
    }
    
  } catch (error) {
    console.error('Error running migration:', error);
  }
}

runMigration();
