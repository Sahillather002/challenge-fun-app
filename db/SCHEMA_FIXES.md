# Database Schema - Supabase Fixes

## Issue Fixed ✅

**Error:** `column "creator_id" does not exist`

**Root Cause:** Supabase manages users in `auth.users` schema, not `public.users`. The schema was trying to create a standalone users table without proper reference.

---

## Changes Made

### 1. **Users Table** - Now References Auth
```sql
-- OLD (Won't work in Supabase)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    ...
);

-- NEW (Works with Supabase Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    ...
);
```

### 2. **Automatic User Profile Creation**
Added trigger to auto-create user profiles when someone signs up:

```sql
CREATE FUNCTION public.handle_new_user()
-- Automatically creates a public.users record 
-- when someone signs up via Supabase Auth
```

This means:
- User signs up → `auth.users` record created by Supabase
- Trigger fires → `public.users` profile created automatically
- No manual intervention needed!

### 3. **Row Level Security (RLS)**
Added security policies for all tables:

- ✅ Users can only update their own profile
- ✅ Users can only see their own fitness data
- ✅ Users can only see their own transactions  
- ✅ Competitions and leaderboards are public
- ✅ Users can only insert their own activity data

### 4. **Explicit Schema References**
All tables now explicitly use `public.` prefix to avoid ambiguity.

---

## How to Use

### Step 1: Run the Fixed Schema

In **Supabase SQL Editor**:

1. Open SQL Editor
2. Clear any previous attempts
3. Copy **entire contents** of `db/schema.sql`
4. Click "Run"
5. Should execute without errors ✅

### Step 2: Verify Tables Created

Run this query to check:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- activity_logs
- competition_participants
- competitions
- fitness_data
- leaderboard_entries
- prizes
- transactions
- users

### Step 3: Test User Creation

When you sign up a new user in your app:

```sql
-- Check auth.users
SELECT id, email FROM auth.users;

-- Check public.users (should auto-populate)
SELECT id, email, name FROM public.users;
```

Both should have the same user ID!

---

## Important Notes

### 🔐 Security

**RLS is ENABLED** on all tables. This means:

- Direct database access respects user permissions
- Users can't access other users' private data
- Your Go backend uses the **service_role** key (bypasses RLS)
- Frontend using **anon** key (respects RLS)

### 🔑 Service Role Key

Your Go backend should use the **service_role** key (not anon key) for full database access:

**In `backends/go-service/.env`:**
```env
# Use service_role key for backend
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres

# Or if using Supabase client in Go
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Get service_role key:**
1. Supabase Dashboard → Settings → API
2. Copy "service_role" key (not "anon public")
3. **KEEP SECRET** - Never expose this in frontend!

### 📝 Auto-populated Fields

When users sign up, `public.users` gets:
- `id` - from auth.users
- `email` - from auth.users  
- `name` - from metadata or email as fallback
- `created_at` / `updated_at` - auto timestamps

---

## Testing the Setup

### 1. Create Test User

Go to your app and sign up with:
- Email: test@example.com
- Password: Test123!@#

### 2. Verify in Database

```sql
-- Should see the test user
SELECT * FROM public.users WHERE email = 'test@example.com';
```

### 3. Test Permissions

Try inserting fitness data:

```sql
-- This should work (as the user)
INSERT INTO fitness_data (user_id, steps, calories, distance, active_minutes, source, date)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'test@example.com'),
    10000, 500, 8000, 60, 'manual', CURRENT_DATE
);

-- This should be prevented by RLS (trying to insert for another user)
INSERT INTO fitness_data (user_id, steps, calories, distance, active_minutes, source, date)
VALUES (
    '00000000-0000-0000-0000-000000000000', -- Random UUID
    10000, 500, 8000, 60, 'manual', CURRENT_DATE
);
-- Error: new row violates row-level security policy
```

---

## Common Issues

### "Permission denied for schema auth"

**Solution:** This is normal. Your tables don't need to access auth schema directly. The trigger handles it.

### "User not created in public.users"

**Check:**
```sql
-- See if trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- See if function exists  
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
```

If missing, run just the trigger portion of the schema again.

### "Cannot insert into competitions"

If you get permission errors:

```sql
-- Temporarily disable RLS for testing
ALTER TABLE public.competitions DISABLE ROW LEVEL SECURITY;

-- Re-enable when done
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
```

Or use service_role key in your backend.

---

## Next Steps

✅ Schema is ready!
✅ Security is configured!
✅ Auto-user creation enabled!

Now you can:

1. Start your Go backend
2. Start your web app
3. Sign up a user
4. Create competitions
5. Sync fitness data

Everything should work seamlessly! 🚀

---

## Database Connection Strings

### For Go Backend (Service Role - Full Access)

```env
DATABASE_URL=postgresql://postgres.[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?sslmode=require
```

### For Direct Connection (pgAdmin, etc.)

Same as above, use service_role password.

### For Frontend (Never used directly)

Frontend uses Supabase client with anon key, not direct DB connection.

---

## Useful Queries

### See All Users
```sql
SELECT u.id, u.email, u.name, u.created_at, au.email_confirmed_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC;
```

### See All Competitions
```sql
SELECT c.*, u.name as creator_name
FROM competitions c
LEFT JOIN users u ON c.creator_id = u.id
ORDER BY c.created_at DESC;
```

### See User's Fitness Data
```sql
SELECT fd.*, c.name as competition_name
FROM fitness_data fd
LEFT JOIN competitions c ON fd.competition_id = c.id
WHERE fd.user_id = 'YOUR-USER-ID'
ORDER BY fd.date DESC;
```

### See Competition Leaderboard
```sql
SELECT 
    le.rank,
    u.name,
    le.steps,
    le.calories,
    le.distance,
    le.score
FROM leaderboard_entries le
JOIN users u ON le.user_id = u.id
WHERE le.competition_id = 'COMPETITION-ID'
ORDER BY le.rank ASC;
```

---

**Schema is ready to use! 🎉**

Run the updated `schema.sql` in Supabase SQL Editor and you're good to go!
