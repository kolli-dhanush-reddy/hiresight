# 🔧 Troubleshooting Guide

## Data Not Loading - Quick Fixes

### Step 1: Check Your Environment Variables

Open your browser console (F12) and look for this message:
```
Missing Supabase environment variables!
```

If you see this, your `.env` file is not being read. 

**Fix:**
1. Make sure `.env` file is in the root directory (same level as `package.json`)
2. Restart your dev server: `npm run dev`
3. Hard refresh your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Step 2: Verify Supabase Connection

1. Open `check-supabase.html` in your browser
2. It will automatically test your connection
3. Look for green ✅ checkmarks

**Common Issues:**
- ❌ "Missing credentials" → Check your `.env` file
- ❌ "Auth Error" → Check your Supabase URL and key
- ⚠️ "Table exists but has no data" → You need to run migrations

### Step 3: Run Database Migrations

Your database tables might be empty. Here's how to fix it:

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Open your project
   - Click "SQL Editor" in the left sidebar

2. **Run Each Migration**
   
   Copy and paste the content from each file in this order:
   
   ```
   1. supabase/migrations/20260310064426_*.sql
   2. supabase/migrations/20260310065143_*.sql
   3. supabase/migrations/20260320054700_*.sql
   4. supabase/migrations/20260320120000_*.sql
   5. supabase/migrations/20260320130000_*.sql  ← This has the data!
   6. supabase/migrations/20260320140000_*.sql
   7. supabase/migrations/20260320150000_*.sql
   8. supabase/migrations/20260320160000_*.sql
   9. supabase/migrations/20260320170000_*.sql
   ```
   
   Click "Run" after pasting each one.

3. **Verify Data**
   
   In Supabase, go to "Table Editor" and check:
   - `year_wise_placement` should have ~6 rows
   - `company_placements` should have ~50+ rows
   - `salary_data` should have ~6 rows

### Step 4: Check RLS Policies

If tables exist but data won't load:

1. Go to Supabase → Authentication → Policies
2. Make sure these policies exist:
   - "Allow read for authenticated users" on all tables
   - "Allow all for admins" on all tables

**Quick Fix SQL:**
```sql
-- Run this in SQL Editor to allow reading data
ALTER TABLE year_wise_placement ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for authenticated users"
  ON year_wise_placement FOR SELECT
  TO authenticated
  USING (true);

-- Repeat for other tables
```

### Step 5: Enable Email Authentication

1. Go to Supabase → Authentication → Providers
2. Make sure "Email" is enabled
3. Save changes

### Step 6: Clear Cache and Reload

Sometimes the browser cache causes issues:

1. Open DevTools (F12)
2. Right-click the refresh button
3. Click "Empty Cache and Hard Reload"

Or just:
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## Specific Error Messages

### "Failed to fetch"
**Cause:** Can't connect to Supabase  
**Fix:** 
1. Check internet connection
2. Verify Supabase project is active
3. Check `.env` file has correct URL

### "Invalid API key"
**Cause:** Wrong or expired Supabase key  
**Fix:**
1. Go to Supabase → Settings → API
2. Copy the "anon public" key
3. Update `.env` file
4. Restart dev server

### "Row Level Security policy violation"
**Cause:** RLS is blocking access  
**Fix:**
1. Make sure you're logged in
2. Check RLS policies in Supabase
3. Run the policy SQL from Step 4 above

### "Table does not exist"
**Cause:** Migrations not run  
**Fix:** Follow Step 3 above

### Charts show "No data available"
**Cause:** Tables are empty  
**Fix:** 
1. Run migration file `20260320130000_seed_placement_data.sql`
2. This file contains all the sample data

---

## Still Not Working?

### Check Browser Console

1. Press F12 to open DevTools
2. Click "Console" tab
3. Look for red error messages
4. Share the error message for help

### Check Network Tab

1. Press F12 → Network tab
2. Refresh the page
3. Look for failed requests (red)
4. Click on them to see details

### Verify Environment

Run this in your terminal:
```bash
# Check if .env file exists
cat .env

# Should show:
# VITE_SUPABASE_URL=https://...
# VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

### Test Supabase Directly

Open `check-supabase.html` in your browser to run automated tests.

---

## Quick Checklist

Before asking for help, verify:

- [ ] `.env` file exists in root directory
- [ ] `.env` has correct Supabase URL and key
- [ ] Dev server restarted after changing `.env`
- [ ] All 9 migrations run in Supabase
- [ ] Email auth enabled in Supabase
- [ ] Browser cache cleared
- [ ] Logged in to the app
- [ ] Browser console checked for errors

---

## Get Help

If none of this works:

1. Open `check-supabase.html` and screenshot the results
2. Open browser console (F12) and screenshot any errors
3. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
4. Open an issue on GitHub with:
   - Screenshots
   - Error messages
   - What you've tried

---

**Most Common Fix:** Run the seed data migration!

The file `supabase/migrations/20260320130000_seed_placement_data.sql` contains all the sample data. If your charts are empty, you probably just need to run this file in Supabase SQL Editor.
