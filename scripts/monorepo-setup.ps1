<#
  Monorepo Clean & Install Script - Optimized
  Single-pass traversal for better performance on large repos
#>

param(
    [switch]$Force,
    [switch]$SkipInstall,
    [switch]$UseWorkspaceProtocol
)

$ErrorActionPreference = "Stop"
$RootDir = $PWD.Path

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Monorepo Clean & Install Script" -ForegroundColor Cyan
Write-Host "  Working directory: $RootDir" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan

# ============================================
# PHASE 1: Cleanup (Single-pass traversal)
# ============================================
Write-Host "`n[PHASE 1] Cleaning up..." -ForegroundColor Yellow

$deleted = 0
$itemsToDelete = @()

Write-Host "  Scanning filesystem..." -ForegroundColor Gray

# Get all items once (fastest approach)
try {
    $allItems = Get-ChildItem -Path $RootDir -Recurse -Force -ErrorAction SilentlyContinue
} catch {
    Write-Host "  Warning: Some paths inaccessible, continuing..." -ForegroundColor Yellow
    $allItems = @()
}

# Categorize items to delete
foreach ($item in $allItems) {
    $relativePath = $item.FullName.Substring($RootDir.Length + 1)
    
    # Skip if starts with .git (safety)
    if ($relativePath -like ".git/*") { continue }

    # Node modules
    if ($item.Name -eq 'node_modules') {
        $itemsToDelete += $item
        continue
    }

    # Lock files
    if ($item -is [System.IO.FileInfo] -and $item.Name -match '^(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb)$') {
        $itemsToDelete += $item
        continue
    }

    # Build artifacts
    if ($item.Name -in @('dist', 'build', '.next', 'out', 'coverage', '.expo', 'migrations', '.cache', '.eslintcache', '.turbo', '.parcel-cache', '.vscode', '.idea')) {
        $itemsToDelete += $item
        continue
    }

    # Specific file patterns
    if ($item -is [System.IO.FileInfo]) {
        if ($item.Name -like '*.tsbuildinfo' -or 
            $item.Name -like '*.db' -or 
            $item.Name -like '*.sqlite' -or 
            $item.Name -like '*.db-journal' -or
            $item.Name -like '*.log' -or
            $item.Name -like 'dev.log' -or
            $item.Name -like 'server.log' -or
            $item.Name -like 'npm-debug.log*' -or
            $item.Name -like 'yarn-debug.log*' -or
            $item.Name -like 'yarn-error.log*' -or
            $item.Name -in @('.DS_Store', 'Thumbs.db', 'eas.json') -or
            $item.Name -like 'eas-build-*') {
            $itemsToDelete += $item
        }
    }
}

# Also add root-level items explicitly
$rootExplicit = @(
    "$RootDir/node_modules",
    "$RootDir/.next",
    "$RootDir/out", 
    "$RootDir/coverage",
    "$RootDir/.cache",
    "$RootDir/.eslintcache",
    "$RootDir/.turbo",
    "$RootDir/.parcel-cache",
    "$RootDir/.vscode",
    "$RootDir/.idea"
)
foreach ($path in $rootExplicit) {
    if (Test-Path $path) {
        $itemsToDelete += Get-Item $path
    }
}

# Root lockfile
$rootLock = Join-Path $RootDir "package-lock.json"
if (Test-Path $rootLock) {
    $itemsToDelete += Get-Item $rootLock
}

# Delete everything
foreach ($item in $itemsToDelete) {
    try {
        Remove-Item -Path $item.FullName -Recurse -Force -ErrorAction SilentlyContinue
        $deleted++
    } catch { }
}

# Clean npm cache
Write-Host "  Cleaning npm cache..." -ForegroundColor Gray
try { npm cache clean --force | Out-Null } catch { }

Write-Host "  Cleaned $deleted items" -ForegroundColor Green

# ============================================
# PHASE 2: Fix Workspace Protocols
# ============================================
Write-Host "`n[PHASE 2] Checking workspace dependency versions..." -ForegroundColor Yellow

$useWsProtocol = $Force -or $UseWorkspaceProtocol
if ($useWsProtocol) {
    Write-Host "  Keeping workspace:* protocol as-is (--Force)" -ForegroundColor Gray
} else {
    Write-Host "  Converting workspace:* to ^1.0.0 for npm compatibility" -ForegroundColor Gray

    $workspacePackages = @(
        "apps/mobile_3/package.json",
        "apps/web_2/package.json",
        "backends/nestjs-fitbattle/package.json",
        "apps/web/package.json",
        "apps/mobile/package.json"
    )

    foreach ($pkgPath in $workspacePackages) {
        $fullPath = Join-Path $RootDir $pkgPath
        if (Test-Path $fullPath) {
            $content = Get-Content $fullPath -Raw
            if ($content -match '"@health-competition/(shared|ui|step-tracker)":\s*"workspace:\*"') {
                $newContent = $content -replace '"workspace:\*"', '"^1.0.0"'
                Set-Content -Path $fullPath -Value $newContent -Encoding UTF8
                Write-Host "  Updated $pkgPath" -ForegroundColor Green
            }
        }
    }

    # Fix root package.json build:web script typo if present
    $rootPkg = Join-Path $RootDir "package.json"
    if (Test-Path $rootPkg) {
        $rootContent = Get-Content $rootPkg -Raw
        if ($rootContent -match '"build:web":\s*"npm run build --workspace=apps/web"') {
            $newRoot = $rootContent -replace '"build:web":\s*"npm run build --workspace=apps/web"', '"build:web": "npm run build --workspace=apps/web_2"'
            Set-Content -Path $rootPkg -Value $newRoot -Encoding UTF8
            Write-Host "  Fixed root package.json build:web script" -ForegroundColor Green
        }
    }
}

# ============================================
# PHASE 3: Install Dependencies
# ============================================
if ($SkipInstall) {
    Write-Host "`n[PHASE 3] Skipping installation (--SkipInstall specified)" -ForegroundColor Yellow
    exit 0
}

Write-Host "`n[PHASE 3] Installing dependencies..." -ForegroundColor Yellow

# Remove any existing root lockfile to ensure fresh resolve
$rootLock = Join-Path $RootDir "package-lock.json"
if (Test-Path $rootLock) {
    Remove-Item $rootLock -Force
    Write-Host "  Removed root package-lock.json" -ForegroundColor Gray
}

# Run npm install with legacy peer deps to avoid Expo conflicts
Write-Host "  Running: npm install --legacy-peer-deps --no-audit --no-fund" -ForegroundColor Gray
Write-Host "  (This may take 5-10 minutes on first run..." -ForegroundColor Gray

npm install --legacy-peer-deps --no-audit --no-fund

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n  ERROR: npm install failed!" -ForegroundColor Red
    Write-Host "  Check the error log above or try: npm run setup:rebuild" -ForegroundColor Yellow
    exit 1
}

# ============================================
# PHASE 4: Verification
# ============================================
Write-Host "`n[PHASE 4] Verifying installation..." -ForegroundColor Yellow

Write-Host "`n  Workspace dependency tree:" -ForegroundColor Gray
try {
    npm ls @health-competition/shared --depth=0 2>$null | Out-String -Width 80 | Write-Host -ForegroundColor White
} catch { Write-Host "  (no output)" -ForegroundColor Gray }

Write-Host "`n  All workspaces status:" -ForegroundColor Gray
try {
    $wsList = npm workspaces list 2>$null
    if ($wsList) { $wsList | ForEach-Object { Write-Host "    $_" -ForegroundColor White } }
    else { Write-Host "    (none found)" -ForegroundColor Gray }
} catch { }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Verify the monorepo is working:" -ForegroundColor White
Write-Host "     npm run build:web" -ForegroundColor Gray
Write-Host "     npm run build:mobile" -ForegroundColor Gray
Write-Host "     npm run build" -ForegroundColor Gray
Write-Host "`n  2. Start development servers:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host "`n  3. Run test suite:" -ForegroundColor White
Write-Host "     npm run test" -ForegroundColor Gray
