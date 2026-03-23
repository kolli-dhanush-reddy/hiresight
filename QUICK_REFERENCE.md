# Quick Reference Guide

## Common Tasks

### Adding a New Data Table

1. **Create migration**
   ```bash
   supabase migration new add_table_name
   ```

2. **Define schema** (in migration file)
   ```sql
   CREATE TABLE table_name (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     -- your columns
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
   );
   
   -- Enable RLS
   ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
   
   -- Add policies
   CREATE POLICY "Allow read for authenticated users"
     ON table_name FOR SELECT
     TO authenticated
     USING (true);
   
   -- Add trigger
   CREATE TRIGGER set_updated_at
     BEFORE UPDATE ON table_name
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at();
   ```

3. **Update types**
   ```bash
   supabase gen types typescript --local > src/integrations/supabase/types.ts
   ```

4. **Create hook** (in `src/hooks/usePlacementData.ts`)
   ```typescript
   export function useTableName() {
     return useQuery({
       queryKey: ["table_name"],
       queryFn: async () => {
         const { data, error } = await supabase
           .from("table_name")
           .select("*")
           .order("created_at");
         if (error) throw error;
         return data;
       },
       placeholderData: [], // Add fallback data
     });
   }
   ```

5. **Add to Admin Panel** (in `src/pages/AdminPanel.tsx`)
   - Create new tab component
   - Add to TabsList
   - Add TabsContent

### Adding a New Page

1. **Create page component** (`src/pages/NewPage.tsx`)
   ```typescript
   import DashboardLayout from "@/components/DashboardLayout";
   
   const NewPage = () => {
     return (
       <DashboardLayout title="Page Title" subtitle="Description">
         {/* Your content */}
       </DashboardLayout>
     );
   };
   
   export default NewPage;
   ```

2. **Add route** (in `src/App.tsx`)
   ```typescript
   import NewPage from "./pages/NewPage";
   
   // In Routes:
   <Route path="/new-page" element={
     <ProtectedRoute>
       <NewPage />
     </ProtectedRoute>
   } />
   ```

3. **Add to sidebar** (in `src/components/AppSidebar.tsx`)
   ```typescript
   {
     title: "New Page",
     url: "/new-page",
     icon: YourIcon,
   }
   ```

### Adding a New Chart Component

1. **Create component** (`src/components/dashboard/NewChart.tsx`)
   ```typescript
   import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
   import { Skeleton } from "@/components/ui/skeleton";
   import { useChartColors } from "@/hooks/useChartColors";
   import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
   
   const NewChart = () => {
     const { grid, axis, tooltip } = useChartColors();
     const { data = [], isLoading, isError } = useYourDataHook();
     
     return (
       <Card className="shadow-card">
         <CardHeader className="pb-2">
           <CardTitle className="text-lg font-display">Chart Title</CardTitle>
         </CardHeader>
         <CardContent>
           {isLoading ? (
             <Skeleton className="h-[300px] w-full rounded-lg" />
           ) : isError ? (
             <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
               Failed to load data
             </div>
           ) : data.length === 0 ? (
             <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
               No data available
             </div>
           ) : (
             <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                   <XAxis dataKey="name" stroke={axis} />
                   <YAxis stroke={axis} />
                   <Tooltip contentStyle={{
                     borderRadius: "0.75rem",
                     border: `1px solid ${tooltip.border}`,
                     background: tooltip.background,
                     color: tooltip.color
                   }} />
                   <Bar dataKey="value" fill="hsl(175, 55%, 40%)" />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           )}
         </CardContent>
       </Card>
     );
   };
   
   export default NewChart;
   ```

### Granting Admin Access

**Method 1: Via Admin Panel (Recommended)**
1. Login as existing admin
2. Go to `/admin`
3. Click "User Roles" tab
4. Enter user email
5. Click "Grant Admin"

**Method 2: Via SQL**
```sql
-- Get user_id from auth.users
SELECT id, email FROM auth.users WHERE email = 'user@example.com';

-- Grant admin role
INSERT INTO user_roles (user_id, role)
VALUES ('user-id-from-above', 'admin');
```

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package-name@latest

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Database Backup & Restore

**Backup**
```bash
# Full backup
supabase db dump > backup.sql

# Specific table
supabase db dump --table table_name > table_backup.sql
```

**Restore**
```bash
# Restore from backup
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

### Debugging Common Issues

**Issue: "Failed to fetch" errors**
```bash
# Check environment variables
cat .env

# Verify Supabase connection
supabase status

# Check browser console for CORS errors
```

**Issue: Charts not rendering**
```typescript
// Add console.log to check data
const { data, isLoading, isError } = useYourHook();
console.log({ data, isLoading, isError });
```

**Issue: Dark mode not working**
```typescript
// Check localStorage
localStorage.getItem('theme')

// Clear and reset
localStorage.removeItem('theme')
window.location.reload()
```

**Issue: Admin access denied**
```sql
-- Check user role
SELECT ur.*, u.email 
FROM user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE u.email = 'your@email.com';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_roles';
```

### Performance Optimization

**Optimize React Query**
```typescript
// Increase stale time for static data
useQuery({
  queryKey: ["static_data"],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

**Optimize Database Queries**
```sql
-- Add index for frequently queried columns
CREATE INDEX idx_table_column ON table_name(column_name);

-- Check query performance
EXPLAIN ANALYZE SELECT * FROM table_name WHERE column = 'value';
```

**Optimize Bundle Size**
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer

# Lazy load routes
const NewPage = lazy(() => import('./pages/NewPage'));
```

### CSV Import Format

**Year-wise Placement**
```csv
year,placed,unplaced,percentage,companies_visited,highest_salary
2024,450,50,90,85,45
```

**Company Placements**
```csv
company,year,hires,salary_pa,job_role
TCS,2024,50,450000,Software Engineer
```

**Salary Data**
```csv
year,min_salary,avg_salary,max_salary
2024,3.5,6.8,45
```

**Department Placements**
```csv
year,department,placed,total,percentage,predicted_percentage,trend
2024,CSE,180,200,90,92,rising
```

### Environment Variables

**Development (.env)**
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
```

**Production (.env.production)**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub

# After merge, update main
git checkout main
git pull origin main

# Delete feature branch
git branch -d feature/new-feature
```

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript check
npm test                 # Run tests

# Supabase
supabase start           # Start local Supabase
supabase stop            # Stop local Supabase
supabase status          # Check status
supabase db reset        # Reset database
supabase db push         # Push migrations
supabase functions deploy # Deploy edge functions
supabase gen types typescript # Generate types

# Git
git status               # Check status
git log --oneline        # View commit history
git diff                 # View changes
git stash                # Stash changes
git stash pop            # Apply stashed changes
```

### Keyboard Shortcuts (VS Code)

- `Ctrl/Cmd + P` - Quick file open
- `Ctrl/Cmd + Shift + P` - Command palette
- `Ctrl/Cmd + B` - Toggle sidebar
- `Ctrl/Cmd + /` - Toggle comment
- `Alt + Up/Down` - Move line up/down
- `Ctrl/Cmd + D` - Select next occurrence
- `F2` - Rename symbol
- `Ctrl/Cmd + Click` - Go to definition

### Testing Checklist

Before deploying:
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] All tests passing (`npm test`)
- [ ] Dark mode works correctly
- [ ] All pages load without errors
- [ ] Charts render correctly
- [ ] CSV import/export works
- [ ] Admin panel CRUD operations work
- [ ] Authentication works
- [ ] Mobile responsive
- [ ] Environment variables set

### Monitoring

**Check Supabase Logs**
```bash
# View logs
supabase functions logs get-user-by-email

# Follow logs in real-time
supabase functions logs get-user-by-email --follow
```

**Check Database Performance**
```sql
-- Active queries
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

For more details, see:
- [README.md](./README.md) - Project overview
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Feature details
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
