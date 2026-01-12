# Quick Start Guide

Get your anonymous survey system running in 10 minutes!

## 1. Supabase Setup (3 minutes)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Paste contents of `supabase/schema.sql` and run it
5. Go to Storage, create bucket named `survey-media` (make it public)
6. Get your API keys from Settings → API

## 2. Local Setup (2 minutes)

```bash
# Copy environment file
cp .env.local.example .env.local

# Edit .env.local with your keys
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - ADMIN_PASSWORD (change this!)
# - ADMIN_SECRET_PATH (change this!)

# Install and run
npm install
npm run dev
```

## 3. Create First Survey (5 minutes)

1. Open `http://localhost:3000/admin-x9QpK7` (or your custom path)
2. Login with your admin password
3. Click "Create Survey"
4. Fill in title, activate it, click Create
5. Click "Categories" → Add category (e.g., "General")
6. Click "Questions" → Add questions
7. Save your survey ID

## 4. Test It!

Open in incognito: `http://localhost:3000/survey/YOUR-SURVEY-ID`

## 5. Monitor Live

Go to Dashboard in admin to see real-time user activity!

## Deploy to Production

Push to GitHub → Import to Vercel → Add environment variables → Deploy!

That's it! 🎉

For detailed setup, see [SETUP_GUIDE.md](SETUP_GUIDE.md)
