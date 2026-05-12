# Monorepo Setup & Maintenance Guide

## Problem Solved

When running `git add .` in the monorepo, internal packages (node_modules, lock files, build artifacts) were being staged. Additionally, `npm install` was failing with `EUNSUPPORTEDPROTOCOL` errors due to workspace protocol conflicts.

## Solutions Implemented

### 1. Updated `.gitignore`
Enhanced to exclude all workspace-level ignored files:
- `**/node_modules/` - all node_modules in any subdirectory
- All lock files recursively (`**/package-lock.json`, etc.)
- Build outputs (`**/dist/`, `**/build/`, `.next/`, `out/`)
- Expo artifacts (`.expo/`, `eas.json`, platform builds)
- TypeScript artifacts (`*.tsbuildinfo`)
- Cache directories, logs, IDE files

**Result:** `git add .` now correctly ignores internal packages.

### 2. Created Setup Scripts

#### PowerShell (Windows)
```bash
npm run setup:clean       # Clean + reinstall (recommended)
npm run setup:rebuild     # Force rebuild with workspace:* protocol
npm run reset             # Same as above (alias)
```

#### Bash (Linux/macOS/WSL)
```bash
npm run setup:clean:bash  # Cross-platform clean + install
```

#### Direct execution
```bash
# PowerShell
scripts/monorepo-setup.ps1

# Bash
bash scripts/monorepo-setup.sh
```

**Script phases:**
1. **Cleanup** - removes node_modules, lockfiles, build artifacts, caches
2. **Fix** - converts `workspace:*` to `^1.0.0` (or keeps original with `--workspace-protocol`)
3. **Install** - fresh `npm install --legacy-peer-deps`
4. **Verify** - shows workspace linking

### 3. Fixed package.json
- Corrected `build:web` script: `apps/web` → `apps/web_2`
- Added setup scripts to root `package.json` for convenience

## Quick Reference

### Common Commands

```bash
# First-time setup (after cloning)
npm run setup:clean

# Development
npm run dev              # Start all dev servers
npm run dev:web          # Start web only
npm run dev:mobile       # Start mobile only
npm run dev:nest         # Start NestJS backend

# Building
npm run build            # Build all workspaces
npm run build:web        # Build web app
npm run build:mobile     # Build mobile app

# Clean reinstall (when things break)
npm run setup:clean

# Check monorepo health
bash scripts/health-check.sh
```

### Git Workflow

```bash
# Check what will be staged (should NOT show node_modules)
git add --dry-run .

# Normal workflow
git add .
git status              # Verify no internal packages listed
git commit -m "message"
```

## When to Re-run Setup

- After pulling new changes with dependency updates
- When you see `EUNSUPPORTEDPROTOCOL` or workspace errors
- If `npm install` fails with peer dependency conflicts
- When workspace symlinks appear broken
- Before creating a PR (ensure clean state)

## Files Changed

| File | Purpose |
|------|---------|
| `.gitignore` | Enhanced to ignore nested node_modules, lockfiles, builds |
| `scripts/monorepo-setup.ps1` | PowerShell clean & install script |
| `scripts/monorepo-setup.bat` | Windows batch file version |
| `scripts/monorepo-setup.sh` | Bash version for Unix/WSL |
| `scripts/health-check.sh` | Diagnostic tool |
| `package.json` | Added setup scripts, fixed build:web typo |

## Important Notes

1. **Workspace Protocol:** The script defaults to `^1.0.0` semver instead of `workspace:*` for npm 10.x compatibility. To use `workspace:*` protocol, run `npm run setup:rebuild` which preserves the original syntax.

2. **Legacy Peer Deps:** Expo and React Native have strict peer requirements. `--legacy-peer-deps` is necessary for successful installation.

3. **Lockfile Strategy:** A single root `package-lock.json` is maintained. Nested lockfiles are removed to prevent conflicts.

4. **Git Safety:** The script only removes untracked/generated files. Your source code, configurations, and commit history are preserved.

## Troubleshooting

### "Permission denied" on script execution
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### Still seeing node_modules in git status
```bash
# Ensure .gitignore patterns are loaded
git rm -r --cached apps/*/node_modules
git add .
```

### npm install still fails after cleanup
```bash
# Manual nuclear option
rm -rf node_modules package-lock.json
npm cache verify
npm install --legacy-peer-deps --force
```

### Workspace packages not linking
```bash
# Check workspace config
npm workspaces list
npm ls @health-competition/shared
```

## Support

For issues:
1. Run `bash scripts/health-check.sh` and share output
2. Check `npm --version` (should be >=9)
3. Check `node --version` (should be >=18)
4. Review the latest npm error log in `%APPDATA%\npm-cache\_logs\` (Windows) or `~/.npm/_logs/` (Unix)

---

**Script location:** `scripts/monorepo-setup.ps1`
**Usage:** `npm run setup:clean` (PowerShell) or `npm run setup:clean:bash` (Bash)
