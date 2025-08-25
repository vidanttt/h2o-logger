# H2O Logger - Water Intake Tracker 💧✨

A beautiful, black-themed water logging application where users can track their daily water intake with user authentication and history tracking.

## Features

- 🔐 **User Authentication** - Register/Login system
- 💧 **Water Tracking** - Track full bottles (500ml) and half bottles (250ml)
- 📊 **Daily Progress** - Visual progress bar with goals
- 📈 **History Tracking** - View past daily water intake
- 🌟 **Girl-Friendly Design** - Beautiful pink/purple gradient theme on black background
- ➕➖ **Add/Remove Water** - Easily adjust your daily intake
- 🎯 **Daily Goals** - 8 bottles (4000ml) daily target

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Production), SQLite (Development)
- **Authentication**: JWT tokens
- **ORM**: Prisma

## Deployment to Vercel - QUICK SETUP 🚀

### Step 1: Set up a PostgreSQL Database

**Recommended: Vercel Postgres**
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project
3. Go to "Storage" tab → "Create Database" → "Postgres"
4. Copy the connection string

### Step 2: Configure Environment Variables in Vercel

In your Vercel project dashboard → Settings → Environment Variables, add:

```
DATABASE_URL=your-postgresql-connection-string-here
JWT_SECRET=generate-a-random-32-character-string
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Deploy
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Deploy automatically!

### Step 4: Initialize Database
After deployment, run in Vercel's terminal or locally:
```bash
npx prisma migrate deploy
```

## Local Development

```bash
# Install dependencies
npm install

# Set up local database (SQLite)
npx prisma migrate dev --name init

# Run development server
npm run dev
```

## Database Schema

- **Users**: id, email, name, password, dates
- **Water Records**: userId, date, fullBottles, halfBottles, totals

## API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login  
- `GET /api/water` - Get today's intake
- `POST /api/water` - Update intake
- `GET /api/water/history` - Get history

## Troubleshooting Vercel Deployment

1. **Prisma errors**: Ensure `DATABASE_URL` is set in Vercel env vars
2. **Build fails**: Check build logs, run `npm run build` locally first
3. **Database issues**: Verify PostgreSQL connection string is correct
