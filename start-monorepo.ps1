# SDE2 Fast-Track: Automated Monorepo Cleanup & Startup
Write-Host "🚀 SDE2: Initializing Clean Monorepo Environment..." -ForegroundColor Green

# 1. Clean up legacy projects
Write-Host "🧹 Deleting legacy projects (mobile, mobile_2, web)..." -ForegroundColor Yellow
Remove-Item -Recurse -Force apps\mobile -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\mobile_2 -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\web -ErrorAction SilentlyContinue

# 2. Fresh dependency install
Write-Host "📦 Installing dependencies (this will install the new web_2 packages)..." -ForegroundColor Yellow
npm install

# 3. Generate Prisma client (Fixes all 50 TS errors in the backend)
Write-Host "🗄️ Generating Prisma Client for NestJS..." -ForegroundColor Yellow
cd backends\nestjs-fitbattle
npx prisma generate
cd ..\..

# 4. Align Expo SDK versions to fix .ts extension errors
Write-Host "📱 Aligning Expo SDK dependencies..." -ForegroundColor Yellow
cd apps\mobile_3
npx expo install --fix
cd ..\..

# 5. Start the stack (clearing Metro cache to fix the .ts extension error)
Write-Host "🔥 Starting the Monorepo..." -ForegroundColor Green
Write-Host "Note: Mobile_3 will start with --clear to wipe the Metro cache." -ForegroundColor Cyan

# Update package.json script to run mobile with --clear temporarily
(Get-Content package.json) -replace '"dev:mobile": "npm run start --workspace=apps/mobile_3"', '"dev:mobile": "npm run start --workspace=apps/mobile_3 -- --clear"' | Set-Content package.json

# Run dev
npm run dev
