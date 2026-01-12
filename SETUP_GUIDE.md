# Anonymous Survey System - Setup Guide

This guide will walk you through setting up the complete anonymous survey system from scratch.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git installed

## Step 1: Supabase Project Setup

### 1.1 Create a New Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: survey-app (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait 2-3 minutes for setup to complete

### 1.2 Get Your API Keys

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (public key)
   - **service_role key**: `eyJhbGc...` (secret key - keep this private!)

### 1.3 Run Database Schema

1. Go to **SQL Editor** in the left sidebar
2. Click "New query"
3. Open `supabase/schema.sql` from your project
4. Copy and paste ALL the SQL code
5. Click **Run** or press `Ctrl/Cmd + Enter`
6. You should see "Success. No rows returned"

### 1.4 Create Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click "Create a new bucket"
3. Enter bucket details:
   - **Name**: `survey-media`
   - **Public bucket**: ✓ (checked)
4. Click "Create bucket"

5. Set up storage policies:
   - Click on the `survey-media` bucket
   - Go to **Policies** tab
   - Click "New Policy"
   - Use the template for public read access
   - Add policies for authenticated uploads (use service role for admin)

## Step 2: Local Development Setup

### 2.1 Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ADMIN_PASSWORD=your-secure-password
   ADMIN_SECRET_PATH=admin-x9QpK7
   ```

   **Important Security Notes:**
   - Change `ADMIN_PASSWORD` to a strong password
   - Change `ADMIN_SECRET_PATH` to a hard-to-guess path
   - NEVER commit `.env.local` to version control

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 3: Admin Access

### 3.1 Login to Admin Dashboard

1. Navigate to: `http://localhost:3000/admin-x9QpK7` (or your custom path)
2. Enter your admin password
3. Click "Login"

### 3.2 Create Your First Survey

1. Click "Create Survey"
2. Fill in:
   - **Title**: Your survey title
   - **Description**: Optional description
   - **Start Date**: When to start (optional)
   - **End Date**: When to end (optional)
   - **Active Survey**: ✓ (check to activate)
3. Click "Create Survey"

### 3.3 Add Categories

1. From the surveys list, click "Categories"
2. Click "Add Category"
3. Enter category name (e.g., "Product Features")
4. Click "Add"
5. Repeat for more categories

### 3.4 Add Questions

1. From the surveys list, click "Questions"
2. Click "Add Question"
3. Fill in:
   - **Question Text**: Your question
   - **Description**: Additional context (optional)
   - **Question Type**: Like/Dislike or Rating 1-5
   - **Category**: Select a category
   - **Media**: Upload image/video/GIF (optional)
4. Click "Create"
5. Repeat for all questions

## Step 4: Testing Your Survey

### 4.1 Get Survey Link

1. Go to Surveys list
2. Note the survey ID from the URL or table
3. Survey URL format: `http://localhost:3000/survey/[survey-id]`

### 4.2 Take the Survey

1. Open survey URL in new incognito/private window
2. Enter age range and gender
3. Click "Start Survey"
4. Answer all questions
5. See completion screen with coupon

### 4.3 View Results

1. Go back to admin dashboard
2. Click "Results" for your survey
3. See aggregated data by demographics
4. View question-by-question breakdown

### 4.4 Monitor Real-time Activity

1. Click "Dashboard" in admin
2. Select your survey
3. Open survey in another browser/device
4. Watch live users appear in dashboard
5. See time spent and current question

## Step 5: Production Deployment

### 5.1 Deploy to Vercel (Recommended)

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. Go to [https://vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. Add Environment Variables:
   - Click "Environment Variables"
   - Add all variables from `.env.local`
   - Click "Deploy"

7. Wait for deployment (2-3 minutes)

### 5.2 Update Supabase URL Whitelist (Optional)

1. Go to Supabase dashboard
2. Settings → API → URL Configuration
3. Add your Vercel domain if needed

### 5.3 Test Production

1. Visit your deployed URL
2. Test survey flow
3. Login to admin dashboard
4. Verify all features work

## Common Issues & Solutions

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure all environment variables are set in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Issue: "Failed to fetch surveys"

**Solution**: 
1. Check if you ran the database schema SQL
2. Verify RLS policies are in place
3. Check browser console for errors

### Issue: "Upload failed"

**Solution**:
1. Verify storage bucket `survey-media` exists
2. Check bucket is set to public
3. Verify storage policies are configured

### Issue: "Can't see real-time updates"

**Solution**:
1. Make sure Realtime is enabled in Supabase project settings
2. Check browser console for WebSocket errors
3. Refresh the page

### Issue: "Admin login not working"

**Solution**:
1. Verify `ADMIN_PASSWORD` is set correctly
2. Clear browser cookies
3. Check middleware.ts is not blocking the login page

## Security Checklist

- [ ] Changed default `ADMIN_PASSWORD`
- [ ] Changed default `ADMIN_SECRET_PATH`
- [ ] `.env.local` is in `.gitignore`
- [ ] Service role key is never exposed to client
- [ ] RLS policies are enabled on all tables
- [ ] Storage bucket policies are configured
- [ ] HTTPS is enforced in production

## Next Steps

1. **Customize Theme**: Edit `src/app/globals.css` to change colors
2. **Add More Question Types**: Extend `QuestionType` enum in `src/lib/types.ts`
3. **Export Results**: Add CSV export functionality
4. **Email Notifications**: Integrate email service for survey completion
5. **Custom Coupons**: Make coupon codes dynamic per survey
6. **Analytics Dashboard**: Add charts using Chart.js or Recharts
7. **Multi-language**: Add i18n support

## Support

For issues or questions:
1. Check the README.md
2. Review the code comments
3. Check Supabase documentation
4. Review Next.js documentation

## License

MIT
