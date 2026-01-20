#!/usr/bin/env tsx
/**
 * Run all database migrations
 * 
 * Usage:
 *   npx tsx run-all-migrations.ts
 * 
 * Or copy the SQL from RUN_ALL_MIGRATIONS.sql and run it in Supabase SQL Editor
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📋 Running all database migrations...\n');

// Read the combined migration SQL file
const migrationSQLPath = join(__dirname, 'RUN_ALL_MIGRATIONS.sql');
let migrationSQL: string;

try {
  migrationSQL = readFileSync(migrationSQLPath, 'utf-8');
  console.log('✅ Loaded migration SQL file\n');
  console.log('📝 Migration SQL:');
  console.log('─'.repeat(60));
  console.log(migrationSQL);
  console.log('─'.repeat(60));
  console.log('\n');
} catch (error) {
  console.error('❌ Error reading migration file:', error);
  console.log('\n📝 Please ensure RUN_ALL_MIGRATIONS.sql exists in the project root.\n');
  process.exit(1);
}

console.log('⚠️  IMPORTANT: This script cannot execute DDL operations directly.');
console.log('   DDL operations (CREATE TABLE, ALTER TABLE) require admin access.');
console.log('\n📌 To run the migrations:');
console.log('\n   1. Go to your Supabase Dashboard:');
console.log('      https://supabase.com/dashboard\n');
console.log('   2. Select your project\n');
console.log('   3. Go to SQL Editor > New Query\n');
console.log('   4. Copy and paste the SQL above\n');
console.log('   5. Click "Run"\n');
console.log('   ──────────────────────────────────────────────────────────\n');
console.log('   ✅ All migrations will run in the correct order');
console.log('   ✅ Using IF NOT EXISTS clauses to prevent errors');
console.log('   ✅ Safe to run multiple times\n');

// If you have Supabase CLI, provide alternative instructions
console.log('\n💡 Alternative: Use Supabase CLI (if installed):');
console.log('   supabase db push\n');
