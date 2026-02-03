Write-Host ""
Write-Host "==============================="
Write-Host "   ADDUP MONOREPO INSTALLER"
Write-Host "==============================="
Write-Host ""

# Move to monorepo root automatically
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ROOT

Write-Host "📍 Current Directory: $ROOT"
Write-Host ""

# -------------------------------
# STEP 1: Install Root Dependencies
# -------------------------------
Write-Host "🔹 Step 1: Installing root dependencies..."
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Root npm install failed. Stopping."
    exit 1
}
Write-Host "✅ Root dependencies installed."
Write-Host ""

# -------------------------------
# STEP 2: Install Mobile App Dependencies
# -------------------------------
Write-Host "🔹 Step 2: Installing Expo Mobile App dependencies..."

Set-Location "$ROOT\apps\mobile_3"

npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Mobile app npm install failed. Stopping."
    exit 1
}

Write-Host "✅ Mobile app dependencies installed."
Write-Host ""

# -------------------------------
# STEP 3: Start Expo (Clean)
# -------------------------------
Write-Host "🚀 Step 3: Starting Expo with clean cache..."
npx expo start --clear

# -------------------------------
# OPTIONAL BACKEND INSTALLS
# -------------------------------

# NestJS Backend
# Uncomment if needed

<#
Write-Host ""
Write-Host "🔹 Installing NestJS backend..."

Set-Location "$ROOT\backends\nestjs-service"
npm install

Write-Host "✅ NestJS dependencies installed."
Write-Host "Run backend using: npm run start:dev"
#>

# Python Backend
# Uncomment if needed

<#
Write-Host ""
Write-Host "🔹 Installing Python backend..."

Set-Location "$ROOT\backends\python-service"
pip install -r requirements.txt

Write-Host "✅ Python dependencies installed."
Write-Host "Run backend using: python app/main.py"
#>

Write-Host ""
Write-Host "==============================="
Write-Host "   ADDUP COMPLETED SUCCESSFULLY"
Write-Host "==============================="
Write-Host ""
