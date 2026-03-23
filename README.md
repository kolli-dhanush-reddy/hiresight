# 🎓 College Placement Analytics Dashboard

A comprehensive full-stack placement analytics platform for MLRIT (Marri Laxman Reddy Institute of Technology) built with React, TypeScript, and Supabase.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## ✨ Features

### 📊 Analytics & Insights
- **Real-time Dashboard** - Year-wise placement statistics with trend analysis
- **Company Intelligence** - Detailed company profiles with hiring patterns
- **Skill Mapping** - Track in-demand skills and emerging technologies
- **Predictive Analytics** - Future placement predictions with confidence metrics
- **Department Analysis** - Performance breakdown by department
- **Salary Trends** - Min/avg/max package analysis over years

### 🎯 Interactive Visualizations
- Area charts for placement trends
- Bar charts for department performance
- Heatmaps for company × department hiring
- Radar charts for multi-metric comparison
- Line charts for salary progression
- Pie charts for rejection analysis

### 🔐 Authentication & Authorization
- Secure email-based authentication via Supabase
- Role-based access control (Admin/User)
- Protected routes with automatic redirects
- Admin panel for user management

### 🎨 Modern UI/UX
- **Dark Mode** - Persistent theme with smooth transitions
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Skeleton Loaders** - Instant UI with graceful loading states
- **Error Boundaries** - Robust error handling throughout
- **Toast Notifications** - User-friendly feedback system

### 🛠️ Admin Panel
- Full CRUD operations on 7 data tables
- CSV import/export functionality
- Pagination for large datasets
- Search and filter capabilities
- User role management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd placement-insights
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Run migrations
   supabase db push
   
   # Deploy edge function
   supabase functions deploy get-user-by-email
   ```

5. **Start development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
placement-insights/
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard-specific charts
│   │   └── ui/              # Reusable UI components (shadcn)
│   ├── contexts/            # React contexts (Auth)
│   ├── data/                # Static fallback data
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Supabase integration
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── supabase/
│   ├── functions/           # Edge functions
│   └── migrations/          # Database migrations
├── public/                  # Static assets
└── ...config files
```

## 🗄️ Database Schema

### Core Tables
- `year_wise_placement` - Annual placement statistics
- `company_placements` - Company hiring records
- `salary_data` - Salary trends
- `top_recruiters` - Top hiring companies
- `prediction_data` - Future predictions
- `department_placements` - Department performance
- `company_details` - Company profiles
- `skill_demand` - Skill tracking
- `user_roles` - User authorization

All tables include:
- Row Level Security (RLS) policies
- Automatic `updated_at` triggers
- Proper indexes for performance
- Data validation constraints

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Recharts** - Data visualization
- **React Query** - Data fetching & caching
- **React Router** - Routing

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security
  - Edge Functions
  - Real-time subscriptions

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Vitest** - Unit testing
- **PostCSS** - CSS processing

## 📊 Key Features Explained

### Dark Mode
- Persistent theme stored in localStorage
- No flash on page load (blocking script)
- All charts dynamically adapt to theme
- Smooth transitions between modes

### Data Hooks
10 custom hooks with automatic fallbacks:
- `useYearWisePlacement()` - Annual stats
- `useSalaryData()` - Salary trends
- `useTopRecruiters()` - Top companies
- `usePredictionData()` - Future predictions
- `useCompanyPlacements()` - Company records
- `useDepartmentPlacements()` - Department stats
- `useHiringHeatmap()` - Heatmap data
- `useSectorTrend()` - Sector analysis
- `useCompanyDetails()` - Company profiles
- `useSkillDemand()` - Skill tracking

### CSV Operations
- Import bulk data via CSV upload
- Export filtered data to CSV
- Preview before import
- Validation and error handling

## 🔒 Security

- ✅ Row Level Security on all tables
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ Environment variables for secrets
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ XSS protection via React

## 📈 Performance

- React Query caching (30s stale time)
- Placeholder data for instant UI
- Code splitting and lazy loading
- Optimized bundle size
- Database indexes on all queries
- Efficient re-renders with React.memo

## 🧪 Testing

```bash
# Run tests
npm run test
# or
bun test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📦 Building for Production

```bash
# Build
npm run build
# or
bun run build

# Preview production build
npm run preview
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Vercel (recommended)
- Netlify
- Cloudflare Pages
- Static hosting

## 📚 Documentation

- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Detailed feature list
- [Deployment Guide](./DEPLOYMENT.md) - Step-by-step deployment
- [Supabase Docs](https://supabase.com/docs) - Backend documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Recharts](https://recharts.org/) - Chart library
- [Lucide Icons](https://lucide.dev/) - Icon set
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📧 Support

For issues or questions:
1. Check the [documentation](./IMPLEMENTATION_SUMMARY.md)
2. Review [deployment guide](./DEPLOYMENT.md)
3. Open an issue on GitHub
4. Check browser console for errors

---

Built with ❤️ for MLRIT Placement Cell
#   h i r e s i g h t  
 #   h i r e s i g h t  
 