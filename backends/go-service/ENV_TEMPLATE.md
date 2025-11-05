# Environment Configuration Template

## Backend (.env file)

Create a `.env` file in `backends/go-service/` with the following variables:

```env
# Server Configuration
PORT=8080

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname?sslmode=disable

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=your_jwt_secret_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_STORAGE_BUCKET=avatars

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
```

## Frontend (.env.local file)

Create a `.env.local` file in `apps/web/` with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Where to Find These Values

### Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. You'll find:
   - **Project URL** → Use for `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → Use for `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### JWT Secret

1. In Supabase Dashboard, go to **Settings** → **API**
2. Scroll to **JWT Settings**
3. Copy the **JWT Secret** → Use for `SUPABASE_JWT_SECRET`

## Security Notes

⚠️ **NEVER commit `.env` files to version control!**

- The `.env` file should be in `.gitignore`
- Service role keys have full admin access - keep them secret
- Anon keys are safe to expose in frontend code
- Use different keys for development and production

## Testing Configuration

After setting up your `.env` files, test the configuration:

### Backend:
```bash
cd backends/go-service
go run cmd/server/main.go
```

You should see:
```
INFO: Database connected successfully
INFO: Database services initialized
INFO: Server starting on port 8080
```

### Frontend:
```bash
cd apps/web
npm run dev
```

Visit http://localhost:3000 and check the browser console for any Supabase connection errors.
