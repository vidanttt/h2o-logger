# Deployment Troubleshooting Guide

## Issue: Users Cannot Create Accounts

### Possible Causes & Solutions

### 1. **Database Not Initialized**

**Check if database exists:**
Visit: `https://your-app.vercel.app/api/health`

If you see "database disconnected", the database needs to be initialized.

**Solution:**
```bash
# If using Vercel Postgres, run in Vercel dashboard terminal:
npx prisma migrate deploy

# Or manually run the SQL from:
# prisma/migrations/20250825000000_initial/migration.sql
```

### 2. **Environment Variables Missing**

**Required environment variables in Vercel:**
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A random 32+ character string

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. **Database Connection Issues**

**Common connection string formats:**

**Vercel Postgres:**
```
postgresql://username:password@host:5432/database?sslmode=require
```

**Supabase:**
```
postgresql://postgres:password@host:5432/postgres?sslmode=require
```

**Railway:**
```
postgresql://postgres:password@host:5432/railway?sslmode=require
```

### 4. **Prisma Client Not Generated**

**Error:** "Cannot find module '@prisma/client'"

**Solution:**
Ensure your `package.json` has:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### 5. **Database Schema Mismatch**

**Error:** Table doesn't exist

**Solution:**
Run the migration manually in your database:

```sql
-- Copy and paste the SQL from:
-- prisma/migrations/20250825000000_initial/migration.sql
```

## Quick Deployment Checklist

- [ ] PostgreSQL database created
- [ ] `DATABASE_URL` set in Vercel environment variables
- [ ] `JWT_SECRET` set in Vercel environment variables  
- [ ] Database initialized with `npx prisma migrate deploy`
- [ ] Health check passes: `/api/health`

## Testing the Deployment

1. **Health Check:** `GET /api/health`
   - Should return: `{"status": "healthy", "database": "connected"}`

2. **User Registration:** `POST /api/auth/register`
   ```json
   {
     "name": "Test User",
     "email": "test@example.com", 
     "password": "password123"
   }
   ```

3. **User Login:** `POST /api/auth/login`
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Database connection error" | `DATABASE_URL` incorrect | Check connection string |
| "Internal server error" | Prisma client issues | Run `prisma generate` |
| "Table users doesn't exist" | Schema not deployed | Run migration SQL |
| "Can't reach database server" | Database not running | Check database status |

## Manual Database Initialization

If automated migration fails, run this SQL in your PostgreSQL database:

```sql
-- See: prisma/migrations/20250825000000_initial/migration.sql
-- Copy the entire contents and run in your database console
```
