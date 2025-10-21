# Monorepo Setup Script
Write-Host "🚀 Setting up Health Competition Monorepo..." -ForegroundColor Green

# Create shared packages structure
Write-Host "`n📦 Creating shared packages..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "packages\shared\src\types", "packages\shared\src\api", "packages\shared\src\utils", "packages\shared\src\constants" -Force | Out-Null
New-Item -ItemType Directory -Path "packages\ui\src\components" -Force | Out-Null
New-Item -ItemType Directory -Path "packages\step-tracker\src" -Force | Out-Null

# Create Next.js web app structure
Write-Host "🌐 Creating Next.js web app structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "apps\web\src\app\(dashboard)", "apps\web\src\app\competitions", "apps\web\src\app\leaderboard", "apps\web\src\app\api" -Force | Out-Null
New-Item -ItemType Directory -Path "apps\web\src\components\ui", "apps\web\src\components\dashboard", "apps\web\src\components\competitions" -Force | Out-Null
New-Item -ItemType Directory -Path "apps\web\src\lib", "apps\web\src\hooks" -Force | Out-Null

# Create basic files for shared package
Write-Host "📝 Creating package files..." -ForegroundColor Yellow

# Packages/shared/package.json
@"
{
  "name": "@health-competition/shared",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.75.0",
    "axios": "^1.6.5",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
"@ | Out-File -FilePath "packages\shared\package.json" -Encoding UTF8

# Packages/ui/package.json
@"
{
  "name": "@health-competition/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.3.3"
  }
}
"@ | Out-File -FilePath "packages\ui\package.json" -Encoding UTF8

# Packages/step-tracker/package.json
@"
{
  "name": "@health-competition/step-tracker",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "@health-competition/shared": "*"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
"@ | Out-File -FilePath "packages\step-tracker\package.json" -Encoding UTF8

Write-Host "`n✅ Basic structure created!" -ForegroundColor Green
Write-Host "`n📚 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm install" -ForegroundColor White
Write-Host "2. See MONOREPO_SETUP_GUIDE.md for detailed implementation" -ForegroundColor White
Write-Host "3. Start development: npm run dev" -ForegroundColor White
Write-Host "`n🎉 Setup complete! Happy coding!" -ForegroundColor Green
