# Complete Supabase Setup Guide

This guide will help you set up Supabase from scratch and connect it to your placement dashboard project.

---

## What is Supabase?

Supabase is like a backend-as-a-service. It gives you:
- A PostgreSQL database (to store your data)
- Authentication (login/signup)
- Real-time subscriptions
- Storage for files
- Auto-generated APIs

Think of it as Firebase, but using PostgreSQL instead of NoSQL.

---

## Step 1: Create a Supabase Account

1. Go to https://supabase.com
2. Click **Start your project** (top right)
3. Sign up using:
   - GitHub account (recommended), OR
   - Email and password
4. Verify your email if needed

---

## Step 2: Create a New Project

1. After logging in, you'll see the dashboard
2. Click **New Project** button
3. Fill in the details:
   - **Name**: `mlrit-placement-dashboard` (or any name you like)
   - **Database Password**: Create a strong password (SAVE THIS! You'll need it)
   - **Region**: Choose closest to you (e.g., `Mumbai` for India)
   - **Pricing Plan**: Select **Free** (perfect for getting started)
4. Click **Create new project**
5. Wait 2-3 minutes while Supabase sets up your database

---

## Step 3: Get Your Project Credentials

Once your project is ready:

1. In the left sidebar, click **Project Settings** (gear icon at bottom)
2. Click **API** in the settings menu
3. You'll see two important values:

   **Project URL** (looks like):
   ```
   https://abcdefghijklmnop.supabase.co
   ```

   **anon/public key** (looks like):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.abcdefghijklmnopqrstuvwxyz123456789
   ```

4. **Copy both values** - you'll need them in the next step

---

## Step 4: Add Credentials to Your Project

1. Open your project folder in VS Code (or any editor)
2. Find the `.env` file in the root directory
3. Open it and update these two lines:

   ```env
   VITE_SUPABASE_URL=https://your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Replace with YOUR actual values from Step 3
5. **Save the file**

Example `.env` file:
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.abcdefghijklmnopqrstuvwxyz123456789
```

---

## Step 5: Create Database Tables

Now we need to create the tables to store placement data.

### 5.1: Open SQL Editor

1. Go back to Supabase dashboard
2. Click **SQL Editor** in the left sidebar (has a `</>` icon)
3. Click **New Query** button

### 5.2: Run Each Migration File

You need to run 7 migration files in order. Here's how:

**Migration 1: Initial Schema**
1. Open file: `supabase/migrations/20260310064426_60540ca2-1dc2-44ad-946d-88b889425cbf.sql`
2. Copy ALL content (Ctrl+A, then Ctrl+C)
3. Paste into Supabase SQL Editor (Ctrl+V)
4. Click **Run** button
5. Wait for "Success" message

**Migration 2: User Profiles**
1. Open file: `supabase/migrations/20260310065143_35c341cf-5618-4850-8a8c-885a6a1daf65.sql`
2. Copy all content
3. Paste into SQL Editor (click **New Query** first)
4. Click **Run**

**Migration 3: Additional Tables**
1. Open file: `supabase/migrations/20260320054700_b63eb765-562e-42b2-923b-e4ce3e0ff18e.sql`
2. Copy all content
3. Paste into SQL Editor (click **New Query** first)
4. Click **Run**

**Migration 4: Constraints & Indexes**
1. Open file: `supabase/migrations/20260320120000_fix_schema_constraints_indexes.sql`
2. Copy all content
3. Paste into SQL Editor (click **New Query** first)
4. Click **Run**

**Migration 5: Seed Placement Data**
1. Open file: `supabase/migrations/20260320130000_seed_placement_data.sql`
2. Copy all content
3. Paste into SQL Editor (click **New Query** first)
4. Click **Run**
5. This one takes 10-15 seconds (lots of data!)

**Migration 6: Department & Sector**
1. Open file: `supabase/migrations/20260320140000_department_and_sector.sql`
2. Copy all content
3. Paste into SQL Editor (click **New Query** first)
4. Click **Run**

**Migration 7: Seed Department & Sector Data**
1. Open file: `supabase/migrations/20260320150000_seed_department_sector.sql`
2. Copy all content
3. Paste into SQL Editor (click **New Query** first)
4. Click **Run**

**Migration 8: Company Details & Skills**
1. Open file: `supabase/migrations/20260320160000_company_details_skills.sql`
2. Copy all content
3. Paste into SQL Editor (click **New Query** first)
4. Click **Run**

**Migration 9: Seed Company & Skills Data**
1. Open file: `supabase/migrations/20260320170000_seed_company_details_skills.sql`
2. Copy all content
3. Paste into SQL Editor (click **New Query** first)
4. Click **Run**

---

## Step 6: Verify Tables Were Created

Run this query to check:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see these tables:
- company_details
- company_placements
- department_placements
- profiles
- skill_demand
- students
- year_wise_placements

---

## Step 7: Enable Row Level Security (RLS)

RLS is already set up in the migrations, but let's verify:

1. In Supabase dashboard, click **Authentication** → **Policies**
2. You should see policies for each table
3. If you see "RLS enabled" with green checkmarks, you're good!

---

## Step 8: Create Your First User

### Option A: Using Supabase Dashboard (Easier)

1. Go to **Authentication** → **Users** in Supabase
2. Click **Add user** → **Create new user**
3. Enter:
   - **Email**: your email (e.g., `admin@mlrit.ac.in`)
   - **Password**: create a password
   - **Auto Confirm User**: Check this box (important!)
4. Click **Create user**
5. The user is created and can login immediately

### Option B: Using Your App's Signup

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Open http://localhost:5173
3. Go to login page
4. Click "Sign up" (if you have a signup form)
5. Create an account

---

## Step 9: Make a User Admin (Optional)

If you want admin access to the Admin Panel:

1. Go to **SQL Editor** in Supabase
2. Run this query (replace with your email):

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

3. Now that user can access `/admin` route

---

## Step 10: Test Your Connection

### Method 1: Use the Diagnostic Tool

1. Open `check-supabase.html` in your browser
2. It will test your Supabase connection
3. You should see green checkmarks

### Method 2: Test in Your App

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```
2. Open http://localhost:5173
3. Login with your credentials
4. You should see the dashboard with real data!

---

## Common Issues & Solutions

### Issue 1: "Invalid API key"
- Double-check your `.env` file
- Make sure you copied the **anon/public** key (not the service_role key)
- Restart your dev server after changing `.env`

### Issue 2: "No data showing"
- Make sure you ran ALL 9 migration files
- Check if data exists: `SELECT COUNT(*) FROM year_wise_placements;`
- Should return 7 rows

### Issue 3: "Can't login"
- Make sure you created a user (Step 8)
- Check if email is confirmed in Supabase dashboard
- Try resetting password

### Issue 4: "Permission denied"
- RLS policies might not be set up correctly
- Re-run migrations 1-4 which set up RLS
- Check Authentication → Policies in Supabase

### Issue 5: Migration fails with "already exists"
- Table/function already exists from previous run
- Either:
  - Skip that migration, OR
  - Drop the table first: `DROP TABLE IF EXISTS table_name CASCADE;`

---

## Understanding Your Database Structure

Your database has 8 main tables:

1. **profiles** - User accounts and roles (admin/user)
2. **students** - Student information
3. **year_wise_placements** - Overall placement stats per year
4. **department_placements** - Department-wise placement data
5. **company_placements** - Individual company placement records
6. **company_details** - Company information and predictions
7. **skill_demand** - Skill trends and demand data

All tables have Row Level Security (RLS) enabled, meaning:
- Users can only see data if they're logged in
- Admins can modify data
- Regular users can only read data

---

## Next Steps

Now that Supabase is set up:

1. ✅ Your database is ready
2. ✅ Real MLRIT data is loaded
3. ✅ Authentication is working
4. ✅ Your app can connect to Supabase

You can now:
- Use the dashboard to view placement analytics
- Use the Admin Panel to add/edit data
- Deploy your app to production (see `DEPLOYMENT.md`)

---

## Useful Supabase Features

### Table Editor
- Click **Table Editor** in sidebar
- View and edit data directly (like Excel)
- Good for quick changes

### Database Backups
- Go to **Database** → **Backups**
- Free plan: Daily backups for 7 days
- Can restore if something goes wrong

### API Documentation
- Click **API Docs** in sidebar
- Auto-generated API docs for your tables
- Shows example code in JavaScript, Python, etc.

### Logs
- Click **Logs** in sidebar
- See all database queries
- Useful for debugging

---

## Cost & Limits (Free Plan)

The free plan includes:
- 500 MB database space (plenty for this project)
- 50,000 monthly active users
- 2 GB bandwidth
- 1 GB file storage
- Unlimited API requests

This is more than enough for a college project!

---

## Need More Help?

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Your Project Docs**: Check `TROUBLESHOOTING.md` and `README.md`

---

## Quick Reference: Important URLs

After setup, bookmark these:

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Your Project**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
- **SQL Editor**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
- **Table Editor**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor
- **API Docs**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/api

Replace `YOUR_PROJECT_ID` with your actual project ID (visible in the URL).

---

That's it! You're now ready to use Supabase with your placement dashboard. 🚀
