# Environment Variables Configuration

This document describes all environment variables needed for the backend services.

## Quick Setup

Copy this configuration to create your `.env` file:

```bash
# Create .env file in project root
cp ENV_VARIABLES.md .env
# Then edit .env with your actual values
```

## Required Variables

### Supabase Configuration
```env
# Get these from your Supabase project settings
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here
```

**Where to find:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the values:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY`
   - JWT Secret → `SUPABASE_JWT_SECRET`

### Redis Configuration
```env
# Local development
REDIS_URL=redis://localhost:6379

# Production (Redis Cloud example)
# REDIS_URL=redis://username:password@redis-host:port

# AWS ElastiCache example
# REDIS_URL=redis://your-elasticache-endpoint:6379
```

### Database (Optional)
```env
# If you need direct database access
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## Service-Specific Ports

```env
# Go Service
PORT=8080

# Rust Service  
PORT=8081

# Python Service
PORT=8082

# NestJS Service
PORT=8083
```

## Environment Settings

```env
# Environment
ENVIRONMENT=development  # or production
NODE_ENV=development     # for NestJS
RUST_LOG=info           # for Rust service
LOG_LEVEL=info          # for Go/Python
```

## Complete .env Template

```env
# ==========================================
# Backend Services Environment Variables
# ==========================================

# ----------------
# Supabase
# ----------------
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-very-long-jwt-secret-here

# ----------------
# Redis
# ----------------
REDIS_URL=redis://localhost:6379

# ----------------
# Database (Optional)
# ----------------
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# ----------------
# Service Ports
# ----------------
# PORT will be set automatically by each service
# No need to set unless you want custom ports

# ----------------
# Environment
# ----------------
ENVIRONMENT=development
NODE_ENV=development
RUST_LOG=info
LOG_LEVEL=info
```

## Service-Specific .env Files

You can also create separate `.env` files in each service directory:

### backends/go-service/.env
```env
PORT=8080
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_key
SUPABASE_JWT_SECRET=your_secret
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
```

### backends/rust-service/.env
```env
PORT=8081
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_key
SUPABASE_JWT_SECRET=your_secret
REDIS_URL=redis://localhost:6379
RUST_LOG=info
```

### backends/python-service/.env
```env
PORT=8082
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_key
SUPABASE_JWT_SECRET=your_secret
REDIS_URL=redis://localhost:6379
LOG_LEVEL=INFO
```

### backends/nestjs-service/.env
```env
PORT=8083
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_key
SUPABASE_JWT_SECRET=your_secret
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

## Production Configuration

For production deployments, set these in your hosting platform:

### Cloud Run
```bash
gcloud run deploy service-name \
  --set-env-vars="SUPABASE_URL=https://..." \
  --set-env-vars="SUPABASE_JWT_SECRET=..." \
  --set-env-vars="REDIS_URL=redis://..."
```

### Docker Compose
Environment variables are loaded from `.env` file automatically.

### AWS ECS
Set environment variables in Task Definition.

### Vercel/Netlify
Add in Environment Variables settings panel.

## Security Best Practices

1. **Never commit .env files to git**
   - Already configured in `.gitignore`
   
2. **Use different secrets for dev/prod**
   - Development: Local Supabase project
   - Production: Production Supabase project

3. **Rotate JWT secrets regularly**
   - Update in Supabase dashboard
   - Update in all backend services

4. **Use managed Redis in production**
   - AWS ElastiCache
   - Redis Cloud
   - Upstash Redis

5. **Limit CORS origins in production**
   - Update CORS settings in each service
   - Only allow your app's domain

## Troubleshooting

### "Connection refused" to Redis
- Ensure Redis is running: `docker-compose up redis`
- Check `REDIS_URL` is correct
- Verify port 6379 is not blocked

### "Invalid JWT token"
- Verify `SUPABASE_JWT_SECRET` matches your Supabase project
- Check token hasn't expired
- Ensure auth header format: `Bearer <token>`

### "Service not accessible"
- Check firewall rules
- Verify correct port is exposed
- Check service is running: `docker-compose ps`

### Environment variables not loading
- Ensure `.env` file is in correct directory
- Check file permissions
- Restart service after changing .env

## Testing Configuration

To verify your configuration:

```bash
# Test each service health endpoint
curl http://localhost:8080/health  # Go
curl http://localhost:8081/health  # Rust
curl http://localhost:8082/health  # Python
curl http://localhost:8083/health  # NestJS

# Test Redis connection
redis-cli ping
# Should return: PONG
```

## Next Steps

1. Create your `.env` file using the template above
2. Fill in your Supabase credentials
3. Start Redis: `docker-compose up redis -d`
4. Start your chosen backend service
5. Test with the health endpoint

For integration with React Native, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
