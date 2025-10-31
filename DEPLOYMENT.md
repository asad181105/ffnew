# Vercel Deployment Guide - Founders Fest

This comprehensive guide will help you deploy the Founders Fest website to Vercel.

## 📋 Prerequisites

- A Vercel account ([sign up here](https://vercel.com/signup))
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ (for local testing)
- A Supabase project (if using Supabase features)

## 🚀 Quick Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to a Git repository**
   
   If you haven't initialized git yet:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import Project on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git repository (GitHub, GitLab, or Bitbucket)
   - Vercel will automatically detect Next.js and configure the project

3. **Configure Environment Variables**
   
   **IMPORTANT:** Never commit your actual environment variables to git!
   
   In the Vercel dashboard during import or in Project Settings → Environment Variables, add:
   
   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Production, Preview, Development |
   
   **Where to find Supabase credentials:**
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy the "Project URL" for `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the "anon public" key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Review the build settings (should be auto-detected)
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)
   - Your site will be live! 🎉

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI globally**
   ```bash
   npm i -g vercel
   ```
   Or use npx:
   ```bash
   npx vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Preview**
   ```bash
   vercel
   ```
   This will:
   - Detect Next.js automatically
   - Create a preview deployment
   - Give you a preview URL

4. **Set Environment Variables via CLI**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   ```
   Repeat for `preview` and `development` environments if needed.

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🔐 Environment Variables

### Required Environment Variables

The following environment variables must be set in Vercel:

| Variable Name | Description | Where to Get It |
|--------------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | Supabase Dashboard → Settings → API |

### Setting Environment Variables in Vercel

1. Go to your project on Vercel Dashboard
2. Click on "Settings"
3. Navigate to "Environment Variables"
4. Add each variable with the appropriate values
5. Select which environments to apply them to (Production, Preview, Development)
6. **Important:** After adding new environment variables, redeploy your project

### Local Development Setup

Create a `.env.local` file in your project root (this file is already in `.gitignore`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Never commit `.env.local` to git!**

## ⚙️ Build Configuration

Vercel automatically detects and configures:

- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node Version:** Automatically uses the latest LTS version

These settings are also configured in `vercel.json` for explicit control.

## 🌐 Custom Domain Setup

1. Go to your project settings on Vercel
2. Click "Domains"
3. Enter your domain name
4. Follow the DNS configuration instructions:
   - For root domain: Add an A record pointing to Vercel's IP
   - For www subdomain: Add a CNAME record pointing to your Vercel deployment
5. Vercel automatically provisions SSL certificates via Let's Encrypt

## ✅ Post-Deployment Checklist

- [ ] Environment variables are set in Vercel dashboard
- [ ] Site loads without errors at the deployment URL
- [ ] Images from Unsplash load correctly
- [ ] Supabase connection works (if using Supabase features)
- [ ] All pages are accessible:
  - [ ] Homepage (`/`)
  - [ ] About page (`/about`)
  - [ ] Explore page (`/explore`)
  - [ ] Founder page (`/founder`)
- [ ] Responsive design works on mobile devices
- [ ] Countdown timer is set correctly
- [ ] Parallax section animations work smoothly
- [ ] No console errors in browser DevTools

## 🐛 Troubleshooting

### Build Errors

**Problem:** Build fails on Vercel

**Solutions:**
1. Check build logs in Vercel dashboard for specific errors
2. Test build locally: `npm run build`
3. Ensure all dependencies are listed in `package.json`
4. Verify Node.js version compatibility (project uses Node 18+)
5. Check for TypeScript errors: `npm run lint`

### Environment Variables Not Working

**Problem:** Environment variables are not being recognized

**Solutions:**
1. Verify variables are set in Vercel dashboard (Settings → Environment Variables)
2. Ensure variable names match exactly (case-sensitive)
3. Redeploy after adding/changing environment variables
4. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
5. Check that variables are added to the correct environment (Production/Preview/Development)

### Images Not Loading

**Problem:** Images from Unsplash or other external sources not loading

**Solutions:**
1. Verify image URLs are accessible
2. Check `next.config.js` has correct `remotePatterns` configuration
3. Ensure images have proper CORS headers
4. For Unsplash, the configuration is already set up in `next.config.js`

### Supabase Connection Issues

**Problem:** Supabase client not working

**Solutions:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
2. Check Supabase project is active and not paused
3. Verify Supabase URL format: `https://xxxxx.supabase.co`
4. Check browser console for specific error messages
5. Ensure Supabase project has correct CORS settings

### Performance Issues

**Problem:** Slow page loads or poor performance

**Solutions:**
1. Use Vercel Analytics to identify bottlenecks
2. Optimize images (Next.js Image component is used)
3. Check bundle size with `npm run build` and review output
4. Enable Vercel Edge Functions if needed
5. Use Vercel's Speed Insights for detailed analysis

## 🚀 Performance Optimizations

Vercel automatically provides:
- ✅ Global Edge Network (CDN) for fast content delivery
- ✅ Automatic HTTPS with SSL certificates
- ✅ Serverless Functions for API routes
- ✅ Automatic Image Optimization
- ✅ Intelligent caching
- ✅ Zero-downtime deployments
- ✅ Preview deployments for every branch/PR

## 📊 Monitoring & Analytics

### Vercel Analytics (Optional)
1. Go to your project settings
2. Navigate to "Analytics"
3. Enable Web Analytics
4. Get insights into:
   - Page views
   - Unique visitors
   - Top pages
   - Referrers
   - Devices and browsers

### Speed Insights (Optional)
1. In project settings, enable "Speed Insights"
2. Get Core Web Vitals metrics
3. Track real user performance data

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production:** Every push to your main/master branch
- **Preview:** Every push to other branches and pull requests
- **Manual:** Triggered from Vercel dashboard or CLI

To disable automatic deployments:
1. Go to Project Settings → Git
2. Unlink repository or configure deployment settings

## 🔧 Advanced Configuration

### Build Time Environment Variables

Some variables can be set at build time:
```bash
vercel env add NODE_ENV production
```

### Regional Deployment

The project is configured to deploy to `iad1` (US East). To change:
1. Edit `vercel.json`
2. Update `regions` array with desired region codes
3. Available regions: `iad1`, `sfo1`, `hnd1`, `sin1`, `syd1`, etc.

### Custom Build Settings

If needed, modify `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Deployment Best Practices](https://vercel.com/docs/deployments/overview)

## 🆘 Getting Help

If you encounter issues:
1. Check Vercel build logs for detailed error messages
2. Review this deployment guide's troubleshooting section
3. Consult [Vercel Support](https://vercel.com/support)
4. Check [Vercel Community](https://github.com/vercel/vercel/discussions)

## 🌐 Production URL

After successful deployment, your site will be available at:
```
https://your-project-name.vercel.app
```

You can find your deployment URL in the Vercel dashboard after the first deployment.

---

**Last Updated:** 2024
**Next.js Version:** 14.0.0
**Node.js Requirement:** 18.x or higher
