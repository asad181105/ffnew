# Quick Start Guide - Vercel Deployment

## 🚀 Deploy in 5 Minutes

### Step 1: Push to Git
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
4. Click "Deploy"

### Step 3: Done! 🎉
Your site will be live at `https://your-project.vercel.app`

## 📋 Pre-Deployment Checklist

- ✅ Build passes locally (`npm run build`)
- ✅ Environment variables prepared (not committed to git)
- ✅ Code pushed to Git repository
- ✅ Vercel account created

## 🔗 Full Documentation

For detailed instructions, troubleshooting, and advanced configuration, see [DEPLOYMENT.md](./DEPLOYMENT.md).

