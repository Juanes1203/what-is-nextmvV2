# Setting Up Your Supabase Project

## Step 1: Create a Supabase Project (if you don't have one)

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose your organization
4. Fill in:
   - **Name**: Your project name
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **Project API keys**: 
     - Copy the **`anon` `public`** key (this is safe for client-side use)
     - Optionally copy the **`service_role` `secret`** key (only for server-side/admin operations)

## Step 3: Configure Environment Variables

1. Create a file named `.env.local` in the root of this project
2. Copy the contents from `.env.local.example`:
   ```bash
   cp .env.local.example .env.local
   ```
3. Edit `.env.local` and replace the placeholders with your actual values:
   ```env
   VITE_SUPABASE_URL=https://your-actual-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-actual-anon-key
   ```

## Step 4: Run Database Migrations

You need to set up the database schema in your Supabase project. There are two ways:

### Option A: Run Migrations via SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy and paste the SQL from each migration file in order:

   **First migration** (`supabase/migrations/20251113134810_2866580b-05b9-472c-81e5-9523d3684095.sql`):
   - This creates the initial tables (pickup_points, vehicles, routes)

   **Second migration** (`supabase/migrations/20250115000000_add_quantity_to_pickup_points.sql`):
   - This adds the quantity column to pickup_points

   **Third migration** (`supabase/migrations/20250115000001_add_grupo_to_vehicles.sql`):
   - This adds the grupo column to vehicles and pickup_points

5. Click **Run** for each migration
6. Verify tables were created by going to **Table Editor**

### Option B: Use Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Step 5: Verify Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. The app should now connect to your Supabase project
4. You should see:
   - Empty lists for vehicles and pickup points (initially)
   - No connection errors in the console

## Troubleshooting

### "Failed to load resource: 401 Unauthorized"
- Check that your `VITE_SUPABASE_PUBLISHABLE_KEY` is correct
- Make sure you copied the `anon` public key, not the `service_role` key

### "Failed to load resource: 404 Not Found"
- Check that your `VITE_SUPABASE_URL` is correct
- Make sure it's the full URL (including `https://`)

### Tables not found
- Make sure you ran all the migrations
- Check the **Table Editor** in Supabase to see if tables exist

### Migration errors
- Make sure you're running migrations in order
- Check the SQL Editor for error messages
- The `IF NOT EXISTS` clauses should prevent errors if columns already exist

## Next Steps

Once set up:
1. You can now add vehicles and pickup points
2. Run route optimizations
3. View optimization history
4. All data will be stored in your Supabase project
