@echo off
REM Monorepo Clean & Install Script (Windows Batch)
REM Usage: monorepo-setup.bat [--workspace-protocol]

setlocal enabledelayedexpansion

echo ========================================
echo   Monorepo Clean ^& Install Script
echo ========================================

REM ============================================
REM PHASE 1: Cleanup
REM ============================================
echo.
echo [PHASE 1] Cleaning up...

echo   Removing node_modules directories...
for /d /r . %%d in (node_modules) do (
    if exist "%%d" (
        rmdir /s /q "%%d" 2>nul
    )
)

echo   Removing lock files...
del /s /q package-lock.json 2>nul
del /s /q yarn.lock 2>nul
del /s /q pnpm-lock.yaml 2>nul
del /s /q bun.lockb 2>nul

echo   Removing build artifacts...
rmdir /s /q .next 2>nul
rmdir /s /q out 2>nul
rmdir /s /q coverage 2>nul
del /s /q *.tsbuildinfo 2>nul

echo   Removing Expo artifacts...
for /d /r . %%d in (.expo) do (
    if exist "%%d" (
        rmdir /s /q "%%d" 2>nul
    )
)
del /s /q eas.json 2>nul

echo   Removing Prisma artifacts...
for /d /r . %%d in (migrations) do (
    if exist "%%d" (
        rmdir /s /q "%%d" 2>nul
    )
)
del /s /q *.db 2>nul
del /s /q *.sqlite 2>nul

echo   Removing cache directories...
rmdir /s /q .cache 2>nul
rmdir /s /q .eslintcache 2>nul
rmdir /s /q .turbo 2>nul

echo   Removing logs...
del /s /q *.log 2>nul

echo   Cleaning npm cache...
npm cache clean --force >nul 2>&1

echo   Cleanup complete!

REM ============================================
REM PHASE 2: Fix Workspace Protocols
REM ============================================
echo.
echo [PHASE 2] Checking workspace dependency versions...

set USE_WS_PROTOCOL=false
if "%~1"=="--workspace-protocol" (
    set USE_WS_PROTOCOL=true
    echo   Keeping workspace:* protocol as-is
) else (
    echo   Converting workspace:* to ^1.0.0 for npm compatibility

    REM Update workspace package.json files
    for %%p in (
        "apps\mobile_3\package.json"
        "apps\web_2\package.json"
        "backends\nestjs-fitbattle\package.json"
        "apps\web\package.json"
        "apps\mobile\package.json"
    ) do (
        if exist "%%p" (
            powershell -Command "(Get-Content '%%p' -Raw) -replace '\"workspace:\*\"', '\"^1.0.0\"' | Set-Content '%%p'"
            echo   Updated %%p
        )
    )

    REM Fix root build:web script
    if exist "package.json" (
        powershell -Command "(Get-Content 'package.json' -Raw) -replace '\"build:web\": \"npm run build --workspace=apps/web\"', '\"build:web\": \"npm run build --workspace=apps/web_2\"' | Set-Content 'package.json'"
        echo   Fixed root package.json build:web script
    )
)

REM ============================================
REM PHASE 3: Install Dependencies
REM ============================================
echo.
echo [PHASE 3] Installing dependencies...

REM Remove root lockfile
if exist package-lock.json (
    del package-lock.json
    echo   Removed root package-lock.json
)

echo   Running: npm install --legacy-peer-deps --no-audit --no-fund
call npm install --legacy-peer-deps --no-audit --no-fund

if errorlevel 1 (
    echo.
    echo   ERROR: npm install failed!
    echo   Check the error log above.
    pause
    exit /b 1
)

REM ============================================
REM PHASE 4: Verification
REM ============================================
echo.
echo [PHASE 4] Verifying installation...

echo.
echo   Workspace dependency tree:
npm ls @health-competition/shared --depth=0 2>nul

echo.
echo   All workspaces:
npm workspaces list 2>nul

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Verify the monorepo is working:
echo      npm run build:web
echo      npm run dev:mobile
echo      npm run dev:nest
echo.
echo   2. Start all development servers:
echo      npm run dev
echo.
echo   3. Build all packages:
echo      npm run build
echo.
pause
