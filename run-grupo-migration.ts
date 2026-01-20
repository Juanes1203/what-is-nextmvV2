// Run this script to execute the grupo migration
// Usage: npx tsx run-grupo-migration.ts
// Or run the SQL directly in Supabase SQL Editor

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                                   process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ VITE_SUPABASE_URL environment variable is required');
  process.exit(1);
}

console.log('📋 Running grupo migration...\n');

// Read the migration SQL file
const migrationSQL = `
-- Add grupo column to vehicles table
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS grupo TEXT;

-- Add grupo column to pickup_points table if it doesn't exist
ALTER TABLE public.pickup_points 
ADD COLUMN IF NOT EXISTS grupo TEXT;
`;

console.log('📝 Migration SQL:');
console.log(migrationSQL);
console.log('\n');

if (SUPABASE_SERVICE_ROLE_KEY) {
  console.log('🔑 Service role key found, attempting to execute migration via Supabase...\n');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Try to execute via RPC or direct SQL
  // Note: Supabase JS client doesn't support direct DDL, so we'll use the REST API
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: migrationSQL })
    });

    if (response.ok) {
      console.log('✅ Migration executed successfully!\n');
      process.exit(0);
    } else {
      console.log('⚠️  Could not execute via REST API (expected - DDL requires direct SQL execution)\n');
    }
  } catch (error) {
    console.log('⚠️  Could not execute via REST API (expected - DDL requires direct SQL execution)\n');
  }
} else {
  console.log('⚠️  Service role key not found.\n');
}

console.log('📌 Please run the SQL manually in Supabase SQL Editor:');
console.log('   1. Go to: https://supabase.com/dashboard');
console.log('   2. Select your project');
console.log('   3. Go to: SQL Editor > New Query');
console.log('   4. Paste the SQL above');
console.log('   5. Click "Run"\n');
console.log('   Or use the Supabase CLI:');
console.log('   supabase db push\n');
