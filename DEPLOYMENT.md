# Deployment Guide - Founders Fest

This guide will help you deploy the Founders Fest website to Vercel.

## Prerequisites

- A Vercel account ([sign up here](https://vercel.com/signup))
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ (for local testing)

## Quick Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import Project on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will automatically detect Next.js

3. **Configure Environment Variables**
   In the Vercel dashboard, add these environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://lxbqongllniqpexymmov.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YnFvbmdsbG5pcXBleHltbW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTQ3NTAsImV4cCI6MjA3NzMzMDc1MH0.WQe9RYD0BIVBsPmEnPS1ZMT10XYMnRft34YmuC75O8M
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables

Make sure to add these environment variables in your Vercel project settings:

| Variable Name | Value |
|--------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lxbqongllniqpexymmov.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YnFvbmdsbG5pcXBleHltbW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTQ3NTAsImV4cCI6MjA3NzMzMDc1MH0.WQe9RYD0BIVBsPmEnPS1ZMT10XYMnRft34YmuC75O8M` |

**Note:** Environment variables need to be added in the Vercel dashboard for each environment (Production, Preview, Development).

## Build Settings

Vercel will automatically detect:
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

## Custom Domain

To add a custom domain:
1. Go to your project settings on Vercel
2. Click "Domains"
3. Add your domain name
4. Follow DNS configuration instructions

## Post-Deployment Checklist

- [ ] Environment variables are set
- [ ] Site loads without errors
- [ ] Images from Unsplash load correctly
- [ ] Supabase connection works
- [ ] All pages are accessible
- [ ] Responsive design works on mobile
- [ ] Countdown timer isset correctly
- [ ] Parallax section animations work

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check the build logs in Vercel dashboard
2. Run `npm run build` locally to test
3. Ensure all dependencies are in `package.json`

### Environment Variables Not Working

1. Verify variables are set in Vercel dashboard
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### Images Not Loading

- Verify Unsplash image URLs are accessible
- Check `next.config.js` remote patterns
- Ensure images have proper CORS headers

## Performance Optimization

Vercel automatically provides:
- ✅ Edge Network (CDN)
- ✅ Automatic HTTPS
- ✅ Serverless Functions
- ✅ Image Optimization
- ✅ Analytics (optional)

## Support

For issues or questions:
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs

## Production URL

After deployment, your site will be available at:
```
https://your-project-name.vercel.app
```

You can find your deployment URL in the Vercel dashboard after the first deployment.

