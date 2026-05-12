# Monorepo Clean & Rebuild Scripts

These scripts help you completely clean and rebuild the monorepo from scratch, resolving common dependency issues and ensuring a fresh start.

## Quick Start

```bash
# Windows PowerShell (recommended)
npm run setup:clean

# Cross-platform (bash/WSL)
npm run setup:clean:bash

# Force rebuild with workspace protocol (advanced)
npm run setup:rebuild

# Complete reset (same as above)
npm run reset
```

## What the Script Does

### Phase 1: Cleanup
Removes all generated files and directories:
- All `node_modules/` folders (recursively across all workspaces)
- All lock files (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`)
- Build artifacts (`dist/`, `build/`, `.next/`, `out/`, `coverage/`)
- Expo artifacts (`.expo/`, `eas.json`, iOS/Android build folders)
- Prisma artifacts (`migrations/`, `.db`, `.sqlite` files)
- Cache directories (`.cache/`, `.eslintcache/`, `.turbo/`)
- TypeScript build info (`*.tsbuildinfo`)
- Log files (`*.log`)

### Phase 2: Dependency Version Fix
Converts workspace protocol versions for npm compatibility:
- Changes `"workspace:*"` → `"^1.0.0"` in all workspace `package.json` files
- Fixes root `build:web` script typo (`apps/web` → `apps/web_2`)
- Use `--workspace-protocol` flag to keep `workspace:*` syntax

**Note:** The `workspace:*` protocol is the recommended syntax for npm workspaces, but some npm versions (especially npm 10.x) have bugs in handling it with nested node_modules. The script defaults to using `^1.0.0` for stability.

### Phase 3: Installation
- Removes root `package-lock.json` to force fresh resolution
- Runs `npm install --legacy-peer-deps --no-audit --no-fund`
- Handles Expo peer dependency conflicts gracefully

### Phase 4: Verification
- Shows the installed workspace dependency tree
- Lists all registered workspaces

## When to Use

| Situation | Command |
|-----------|---------|
| Fresh clone of repository | `npm run setup:clean` |
| Dependency conflicts / errors | `npm run setup:clean` |
| After switching branches with dependency changes | `npm run setup:clean` |
| Workspace linking broken | `npm run setup:clean` |
| Want to keep `workspace:*` protocol | `npm run setup:rebuild` |
| Complete nuclear reset | `npm run reset` |

## Troubleshooting

### "Unsupported URL Type workspace:*"
This indicates npm can't parse the workspace protocol. Run:
```bash
npm run setup:clean
```
The script will convert workspace versions to semver ranges.

### Peer dependency conflicts with Expo
The script uses `--legacy-peer-deps` to bypass strict peer resolution needed for Expo SDK compatibility. If you see peer conflicts, ensure you're using the legacy mode.

### npm cache issues
The script automatically cleans npm's cache. If problems persist, manually run:
```bash
npm cache clean --force
```

### Lockfile conflicts
All nested lockfiles are removed. The root `package-lock.json` is regenerated to ensure consistency across all workspaces.

### Permissions denied (Windows)
Run PowerShell as Administrator, or set execution policy temporarily:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

## Files Modified by Script

The script modifies these files when NOT using `--workspace-protocol`:
- `apps/mobile_3/package.json`
- `apps/web_2/package.json`
- `backends/nestjs-fitbattle/package.json`
- `apps/web/package.json` (if exists)
- `apps/mobile/package.json` (if exists)
- `package.json` (root `build:web` script fix only)

All changes are reversible by reverting to git.

## Manual Cleanup

If you prefer manual steps:

```bash
# 1. Remove all node_modules
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# 2. Remove all lock files
find . -name "package-lock.json" -type f -delete

# 3. Clean npm cache
npm cache clean --force

# 4. Reinstall
npm install --legacy-peer-deps
```

## Notes

- The script is **idempotent** - safe to run multiple times
- It preserves all configuration files, source code, and `.env` files
- Git status is respected - only untracked generated files are removed
- Workspace symlinks are recreated on install
- The monorepo uses **npm workspaces** (not pnpm or yarn)

## Support

If issues persist after running the script:
1. Check Node.js version: `node --version` (should be >=18)
2. Check npm version: `npm --version` (should be >=9)
3. Delete `package-lock.json` manually and retry
4. Open an issue with the full error log
