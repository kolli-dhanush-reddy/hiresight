# Deployment Guide

## Prerequisites

- Node.js 18+ and npm/bun
- Supabase account
- Git

## Environment Setup

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Configure environment variables**
   
   Create `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

## Database Setup

1. **Run migrations**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Run all migrations
   supabase db push
   ```

2. **Deploy edge function**
   ```bash
   supabase functions deploy get-user-by-email
   ```

3. **Verify tables**
   - Check Supabase dashboard → Table Editor
   - Should see 8 tables with seed data

## Authentication Setup

1. **Enable Email Auth**
   - Supabase Dashboard → Authentication → Providers
   - Enable Email provider
   - Configure email templates (optional)

2. **Create first admin user**
   ```sql
   -- Run in Supabase SQL Editor
   -- Replace with your email
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
   VALUES ('admin@example.com', crypt('your-password', gen_salt('bf')), now());
   
   -- Get the user_id from the result, then:
   INSERT INTO user_roles (user_id, role)
   VALUES ('user-id-from-above', 'admin');
   ```

## Local Development

```bash
# Start dev server
npm run dev
# or
bun run dev

# Open http://localhost:5173
```

## Production Build

```bash
# Build for production
npm run build
# or
bun run build

# Preview production build
npm run preview
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add environment variables**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Configure environment variables**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Option 3: Static Hosting (Cloudflare Pages, GitHub Pages, etc.)

1. **Build**
   ```bash
   npm run build
   ```

2. **Deploy `dist` folder** to your hosting provider

3. **Configure environment variables** according to your provider's documentation

## Post-Deployment

1. **Test authentication**
   - Visit `/login`
   - Sign in with admin credentials
   - Verify redirect to `/dashboard`

2. **Test admin panel**
   - Visit `/admin`
   - Verify CRUD operations work
   - Test CSV import/export

3. **Test data loading**
   - Check all pages load correctly
   - Verify charts render
   - Test dark mode toggle

4. **Grant admin access to other users**
   - Login as admin
   - Go to Admin Panel → User Roles tab
   - Enter user email and click "Grant Admin"

## Troubleshooting

### "Failed to fetch" errors
- Check `.env` file has correct Supabase credentials
- Verify Supabase project is active
- Check browser console for CORS errors

### Charts not rendering
- Clear browser cache
- Check browser console for errors
- Verify data is loading (check Network tab)

### Dark mode not persisting
- Check localStorage is enabled in browser
- Clear site data and try again

### Admin panel shows "Access Denied"
- Verify user has admin role in `user_roles` table
- Check RLS policies are enabled
- Verify `has_role()` function exists

### CSV import fails
- Check CSV format matches expected columns
- Verify data types are correct
- Check browser console for detailed error

## Performance Optimization

1. **Enable caching**
   - Configure CDN caching for static assets
   - Set appropriate cache headers

2. **Optimize images**
   - Use WebP format where possible
   - Implement lazy loading

3. **Database indexes**
   - Already configured in migrations
   - Monitor slow queries in Supabase dashboard

4. **Query optimization**
   - React Query caching configured (30s staleTime)
   - Placeholder data prevents loading states

## Security Checklist

- ✅ RLS enabled on all tables
- ✅ Environment variables not committed
- ✅ Admin routes protected
- ✅ HTTPS enforced (via hosting provider)
- ✅ Input validation on forms
- ✅ SQL injection prevention (Supabase client)
- ✅ XSS prevention (React escaping)

## Monitoring

1. **Supabase Dashboard**
   - Monitor database usage
   - Check API logs
   - Review auth activity

2. **Application Monitoring**
   - Set up error tracking (Sentry, LogRocket, etc.)
   - Monitor performance metrics
   - Track user analytics

## Backup

1. **Database backups**
   - Supabase Pro plan includes daily backups
   - Manual backup: `supabase db dump > backup.sql`

2. **Code backups**
   - Push to Git repository regularly
   - Tag releases: `git tag v1.0.0`

## Updates

1. **Update dependencies**
   ```bash
   npm update
   npm audit fix
   ```

2. **Database migrations**
   ```bash
   # Create new migration
   supabase migration new migration_name
   
   # Apply migration
   supabase db push
   ```

3. **Deploy updates**
   ```bash
   git push
   # Vercel/Netlify will auto-deploy
   ```

## Support

For issues or questions:
1. Check browser console for errors
2. Review Supabase logs
3. Check this documentation
4. Review `IMPLEMENTATION_SUMMARY.md` for architecture details
