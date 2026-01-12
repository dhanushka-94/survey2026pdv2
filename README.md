# Anonymous Survey System

A production-ready anonymous survey system built with Next.js, Supabase, and Tailwind CSS.

## Features

- 🔒 **Anonymous Surveys** - No login required, only age range and gender collected
- 📊 **Real-time Analytics** - Track live users and their progress
- 🎨 **Beautiful UI** - Modern, responsive design with love-reddish theme
- 📱 **Mobile-First** - Fully responsive and touch-friendly
- 🎯 **Admin Dashboard** - Complete CRUD for surveys, categories, and questions
- 📸 **Media Support** - Upload images, videos, and GIFs for questions
- ⚡ **Real-time Tracking** - See where users are in the survey in real-time

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Styling**: Tailwind CSS 4
- **TypeScript**: Full type safety

## Setup Instructions

### 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Go to **Project Settings** > **API** and copy:
   - Project URL
   - `anon` `public` key
   - `service_role` key (keep this secret!)

### 2. Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to create all tables, indexes, and policies

### 3. Storage Bucket Setup

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `survey-media`
3. Set it to **Public**
4. Set file size limit to **50MB**
5. Under **Policies**, create the storage policies mentioned in `schema.sql`

### 4. Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_PASSWORD=your-secure-password
   ADMIN_SECRET_PATH=admin-x9QpK7
   ```

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Admin Access

Access the admin dashboard at: `http://localhost:3000/admin-x9QpK7`

(Or whatever you set `ADMIN_SECRET_PATH` to in your `.env.local`)

Default password: whatever you set in `ADMIN_PASSWORD`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [admin]/           # Admin dashboard (dynamic path)
│   └── survey/[id]/       # Public survey pages
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── survey/           # Survey-specific components
│   └── ui/               # Reusable UI components
├── actions/              # Server actions
├── lib/                  # Utilities and configs
│   ├── supabase/        # Supabase clients
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Helper functions
└── middleware.ts         # Route protection
```

## Usage

### Creating a Survey

1. Log in to admin dashboard
2. Go to **Surveys** > **New Survey**
3. Fill in title, description, dates
4. Create categories for your questions
5. Add questions with media (optional)
6. Activate the survey
7. Share the survey link with respondents

### Viewing Results

1. Go to **Surveys** > Select survey > **Results**
2. View aggregated responses
3. Filter by age range and gender
4. Export data if needed

### Real-time Tracking

1. Go to **Dashboard**
2. Select an active survey
3. See live users and their progress
4. Track time spent on each question

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Node.js

## Security

- Admin routes protected by middleware
- Row Level Security (RLS) enabled in Supabase
- Service role key only used server-side
- Anonymous responses (no personal data)
- HTTPS enforced in production

## License

MIT
