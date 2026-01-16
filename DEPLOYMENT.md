# Deployment Guide

Deploy your Product Tracker to Netlify in minutes!

## Prerequisites

- GitHub account
- Supabase account (free tier)
- Netlify account (free tier)

## Step 1: Set Up Supabase Database

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com) and sign up
   - Click "New Project"
   - Choose a name, database password, and region
   - Wait for project to be created (~2 minutes)

2. **Run Database Schema**
   - In Supabase dashboard, go to **SQL Editor**
   - Click **New query**
   - Copy and paste the entire contents of `supabase-schema.sql`
   - Click **Run** (or press Cmd/Ctrl + Enter)
   - You should see success messages

3. **Get API Credentials**
   - Go to **Settings** → **API**
   - Copy these two values:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon public** key (long string starting with `eyJ...`)

## Step 2: Push Code to GitHub

1. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**
   - Go to [github.com](https://github.com) and create a new repository
   - Don't initialize with README (you already have one)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Netlify

### Option A: Via Netlify Dashboard (Recommended)

1. **Import Project**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click **Add new site** → **Import an existing project**
   - Choose **GitHub** and authorize Netlify
   - Select your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: Leave empty (Next.js plugin handles this)
   - Click **Show advanced**
   - Node version: `20` (or latest LTS)

3. **Add Environment Variables**
   - Before deploying, click **Show advanced** → **New variable**
   - Add these three variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ... (your anon key)
     ADMIN_PASSWORD = your_secure_password_here
     ```

4. **Deploy**
   - Click **Deploy site**
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Option B: Via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize**
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Choose your team
   - Site name: (press Enter for auto-generated)
   - Build command: `npm run build`
   - Publish directory: (press Enter - leave empty)

4. **Set Environment Variables**
   ```bash
   netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://xxxxx.supabase.co"
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_anon_key_here"
   netlify env:set ADMIN_PASSWORD "your_secure_password_here"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Step 4: Verify Deployment

1. Visit your Netlify site URL
2. You should see the login page
3. Login with your `ADMIN_PASSWORD`
4. Test by:
   - Adding a store (if "The Real Real" doesn't exist)
   - Adding a product
   - Viewing analytics

## Troubleshooting

### Build Fails
- ✅ Check all 3 environment variables are set in Netlify
- ✅ Verify Node version is 20 or higher
- ✅ Check build logs in Netlify dashboard for specific errors

### Database Connection Issues
- ✅ Verify Supabase URL and anon key are correct (no extra spaces)
- ✅ Confirm you ran the SQL schema in Supabase
- ✅ Check Supabase project is active (not paused)

### Authentication Not Working
- ✅ Verify `ADMIN_PASSWORD` is set in Netlify environment variables
- ✅ Clear browser cookies and try again
- ✅ Check browser console for errors

### Can't Access Site
- ✅ Ensure deployment completed successfully (green checkmark)
- ✅ Check site is not in "Draft" mode
- ✅ Verify custom domain settings if using one

## Post-Deployment Checklist

- [ ] Set a strong `ADMIN_PASSWORD` in Netlify
- [ ] Verify "The Real Real" store exists (or add it)
- [ ] Test adding a product
- [ ] Test viewing analytics
- [ ] Bookmark your site URL

## Updating Your Site

**Automatic Deploys**: Every time you push to GitHub, Netlify will:
- Automatically rebuild your site
- Deploy the new version
- Update within 2-3 minutes

No manual steps needed! Just `git push` and wait.

## Free Tier Limits

Both services have generous free tiers:

- **Supabase**: 500MB database, 2GB bandwidth/month
- **Netlify**: 100GB bandwidth/month, 300 build minutes/month

Perfect for personal use! 🎉

## Need Help?

- Check Netlify build logs for errors
- Verify environment variables are set correctly
- Ensure Supabase project is active
- Check browser console for client-side errors
