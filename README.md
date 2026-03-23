# 🎓 College Placement Analytics Dashboard

A modern web app to track and analyze college placement data with beautiful charts and insights.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

## ✨ What Does It Do?

This app helps placement officers and students:
- 📊 View placement statistics with interactive charts
- 🏢 Track which companies hire from your college
- 💰 Analyze salary trends over the years
- 🎯 See which skills are in demand
- 📈 Predict future placement trends
- 👥 Manage all placement data from an admin panel

## 🎨 Features

### For Everyone
- **Dashboard** - See placement stats at a glance
- **Company Insights** - Detailed info about hiring companies
- **Skill Trends** - Know which skills companies want
- **Predictions** - Future placement forecasts
- **Dark Mode** - Easy on the eyes

### For Admins
- **Data Management** - Add, edit, delete placement records
- **CSV Import** - Upload data in bulk
- **CSV Export** - Download data for reports
- **User Management** - Grant admin access to others

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### 3. Run Locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 📱 Screenshots

### Dashboard
View all your placement stats in one place with beautiful charts.

### Company Intelligence
See detailed profiles of companies that hire from your college.

### Admin Panel
Manage all your placement data easily with a simple interface.

## 🛠️ Tech Stack

**Frontend:**
- React + TypeScript
- Tailwind CSS for styling
- Recharts for graphs
- shadcn/ui components

**Backend:**
- Supabase (Database + Auth)
- PostgreSQL database
- Row Level Security

## 📖 Documentation

Need more details? Check these guides:

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - How to deploy your app
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Common tasks and fixes
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details

## 🚀 Deploy to Production

### Option 1: Vercel (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add your environment variables
6. Click "Deploy"

Done! Your app is live in 5 minutes.

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `dist` folder
3. Add environment variables
4. Done!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔐 First Time Setup

After deploying:

1. **Create Supabase Project**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your URL and API key

2. **Run Database Migrations**
   - Open Supabase SQL Editor
   - Copy and paste each migration file from `supabase/migrations/`
   - Run them in order

3. **Create Admin User**
   - Sign up through your app
   - In Supabase, run:
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('your-user-id', 'admin');
   ```

4. **Start Using!**
   - Login to your app
   - Go to Admin Panel
   - Add your placement data

## 💡 Common Questions

**Q: How do I add placement data?**  
A: Login as admin → Go to Admin Panel → Use the forms or import CSV

**Q: Can I customize the look?**  
A: Yes! Edit `tailwind.config.ts` to change colors and styles

**Q: How do I grant admin access to others?**  
A: Admin Panel → User Roles tab → Enter their email → Click "Grant Admin"

**Q: Is my data secure?**  
A: Yes! We use Supabase with Row Level Security. Only authenticated users can view data, and only admins can edit.

## 🐛 Troubleshooting

**App won't load?**
- Check your `.env` file has correct Supabase credentials
- Make sure Supabase project is active

**Can't login?**
- Check email authentication is enabled in Supabase
- Check your spam folder for confirmation email

**Charts not showing?**
- Clear browser cache
- Check browser console for errors
- Make sure database has data

**Need more help?**  
Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for detailed troubleshooting.

## 📊 Project Stats

- **9 Pages** - Dashboard, Companies, Skills, Trends, Admin, etc.
- **8 Database Tables** - All your placement data organized
- **50+ UI Components** - Beautiful and reusable
- **Dark Mode** - Built-in theme switching
- **Mobile Friendly** - Works on all devices

## 🤝 Contributing

Want to improve this project?

1. Fork the repository
2. Create a new branch (`git checkout -b feature/cool-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add cool feature'`)
5. Push (`git push origin feature/cool-feature`)
6. Open a Pull Request

## 📝 License

MIT License - feel free to use this for your college!

## 🙏 Credits

Built with:
- [React](https://react.dev/) - UI framework
- [Supabase](https://supabase.com/) - Backend
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Components
- [Recharts](https://recharts.org/) - Charts

## 📧 Support

Having issues? 
1. Check the documentation files
2. Look at browser console for errors
3. Check Supabase logs
4. Open an issue on GitHub

---

**Made with ❤️ for college placement cells**

*Star ⭐ this repo if you find it helpful!*
