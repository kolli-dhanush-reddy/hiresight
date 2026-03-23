# Step-by-Step Guide: Loading Real MLRIT Data into Your Dashboard

Follow these steps to populate your database with real MLRIT placement data.

---

## Step 1: Open Your Supabase Project

1. Go to https://supabase.com/dashboard
2. Sign in with your account
3. Click on your project (the one you created for this dashboard)

---

## Step 2: Navigate to SQL Editor

1. In the left sidebar, click on **SQL Editor** (it has a `</>` icon)
2. Click **New Query** button (top right)

---

## Step 3: Clear Existing Data (Important!)

Before adding new data, we need to clear the old placeholder data.

1. Copy and paste this SQL into the editor:

```sql
-- Clear existing seed data
DELETE FROM skill_demand;
DELETE FROM company_details;
DELETE FROM company_placements;
DELETE FROM department_placements;
DELETE FROM year_wise_placements;
```

2. Click **Run** button (or press Ctrl+Enter)
3. You should see "Success. No rows returned"

---

## Step 4: Load Placement Data (First Migration)

1. Open the file: `supabase/migrations/20260320130000_seed_placement_data.sql`
2. **Select ALL the content** (Ctrl+A)
3. **Copy it** (Ctrl+C)
4. Go back to Supabase SQL Editor
5. Click **New Query** again
6. **Paste** the entire content (Ctrl+V)
7. Click **Run** button
8. Wait for it to complete (should take 5-10 seconds)
9. You should see "Success. No rows returned"

This adds:
- Year-wise placement statistics (2019-2025)
- Department-wise placements
- Company placements with real recruiters

---

## Step 5: Load Company & Skills Data (Second Migration)

1. Open the file: `supabase/migrations/20260320170000_seed_company_details_skills.sql`
2. **Select ALL the content** (Ctrl+A)
3. **Copy it** (Ctrl+C)
4. Go back to Supabase SQL Editor
5. Click **New Query** again
6. **Paste** the entire content (Ctrl+V)
7. Click **Run** button
8. Wait for it to complete (should take 5-10 seconds)
9. You should see "Success. No rows returned"

This adds:
- 30 real MLRIT recruiters with details
- Skill demand data based on actual job roles

---

## Step 6: Verify Data Loaded Successfully

Run this query to check if data is loaded:

```sql
-- Check data counts
SELECT 
  (SELECT COUNT(*) FROM year_wise_placements) as year_wise_count,
  (SELECT COUNT(*) FROM department_placements) as dept_count,
  (SELECT COUNT(*) FROM company_placements) as company_placements_count,
  (SELECT COUNT(*) FROM company_details) as company_details_count,
  (SELECT COUNT(*) FROM skill_demand) as skills_count;
```

You should see:
- year_wise_count: 7 (years 2019-2025)
- dept_count: 35 (7 years × 5 departments)
- company_placements_count: ~200+
- company_details_count: 30
- skills_count: 15

---

## Step 7: Test Your Website

1. Open your website in the browser
2. Go to the login page
3. Login with your credentials
4. You should now see:
   - Real placement numbers on the dashboard
   - Actual company names (TCS, Accenture, Infosys, etc.)
   - Real salary data
   - Department-wise statistics
   - Company comparison with real recruiters
   - Skill mapping with actual job roles

---

## Troubleshooting

### If you see "No data available":

1. Check your `.env` file has correct Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Open browser console (F12) and check for errors

3. Use the diagnostic tool:
   - Open `check-supabase.html` in your browser
   - It will test your Supabase connection

### If migrations fail:

1. Make sure you cleared old data first (Step 3)
2. Run migrations one at a time
3. Check the error message in Supabase SQL Editor
4. If you see "duplicate key" errors, the data might already exist

### Still having issues?

Check `TROUBLESHOOTING.md` for more detailed debugging steps.

---

## What Data You'll See

The dashboard now shows real MLRIT placement data:

- **2019**: 427 students placed
- **2020**: 346 students placed  
- **2021**: 740 students placed
- **2022**: 1,236 students placed (peak year!)
- **2023**: 734 students placed
- **2024**: 674 students placed
- **2025**: 536 students placed

Top recruiters with actual hiring numbers:
- Accenture: 395 students
- TCS: 285 students
- Cognizant: 178 students
- Infosys: 156 students
- Wipro: 134 students

All salary data is based on actual MLRIT placement statistics!

---

## Need Help?

If you're stuck, check:
1. `TROUBLESHOOTING.md` - Common issues and fixes
2. `README.md` - General setup guide
3. `DEPLOYMENT.md` - Deployment instructions

Or reach out with the specific error message you're seeing.
