# Scripts Folder Overview

## Purpose
Central location for all utility scripts that support development, testing, cleanup, and maintenance of the health competition monorepo.

## Scripts

### Setup & Maintenance

#### `monorepo-setup.ps1` (PowerShell - Windows)
**Primary recommended script** for complete clean + reinstall.

```bash
npm run setup:clean
# or directly:
powershell -ExecutionPolicy Bypass -File scripts/monorepo-setup.ps1
```

**Features:**
- Single-pass filesystem scan (optimized)
- Removes all node_modules, lockfiles, build artifacts
- Fixes workspace dependency versions for npm compatibility
- Installs fresh with `--legacy-peer-deps`
- Verifies workspace linking
- Detailed progress reporting

**Parameters:**
- `-Force` → Keep `workspace:*` protocol (advanced)
- `-SkipInstall` → Clean only, skip installation
- `-UseWorkspaceProtocol` → Alias for `-Force`

---

#### `monorepo-setup.sh` (Bash - Linux/macOS/WSL)
Cross-platform version for non-Windows environments.

```bash
npm run setup:clean:bash
# or:
bash scripts/monorepo-setup.sh
```

Same features as PowerShell version, optimized with `find`.

---

#### `monorepo-setup.bat` (Windows CMD)
Legacy batch file for CMD.exe users.

```cmd
scripts\monorepo-setup.bat
```

---

#### `health-check.sh` (Bash)
Diagnostic tool to verify monorepo health.

```bash
npm run health
# or:
bash scripts/health-check.sh
```

**Checks:**
- Node.js and npm versions
- Workspace registration
- node_modules presence (should be clean)
- Lock file existence
- Workspace linking verification

---

### Testing

#### `run-all-tests.js`
Categorized test runner with summary reporting.

```bash
node scripts/run-all-tests.js
```

Runs test categories:
- Authentication Tests
- Competition Tests  
- Payment Tests
- Dashboard Tests
- Settings Tests
- Context Tests
- Service Tests
- Component Tests
- Utility Tests

---

#### `test-runner.js`  
Comprehensive test orchestrator with metrics.

```bash
node scripts/test-runner.js
```

Runs:
- Unit tests (Jest)
- Performance tests
- API integration tests
- Google Fit integration tests

Generates `test-results.json` with full metrics.

---

#### Supporting test scripts
- `api-integration-test.js` - API endpoint tests
- `google-fit-test.js` - Google Fit API tests
- `performance-test.js` - Performance benchmarks

---

## NPM Script Shortcuts

Added to root `package.json`:

| Command | Equivalent |
|---------|-----------|
| `npm run setup` | `npm run setup:clean` |
| `npm run setup:clean` | PowerShell clean + install |
| `npm run setup:clean:bash` | Bash clean + install |
| `npm run setup:rebuild` | Clean + install with workspace:* |
| `npm run reset` | Alias for setup:rebuild |
| `npm run health` | Run health check |

---

## When to Use Which Script

| Scenario | Command |
|----------|---------|
| First time after clone | `npm run setup:clean` |
| Dependency conflicts | `npm run setup:clean` |
| Workspace linking broken | `npm run setup:clean` |
| Peer dependency errors | `npm run setup:clean` |
| Want workspace:* protocol | `npm run setup:rebuild` |
| Quick health check | `npm run health` |
| Run full test suite | `node scripts/run-all-tests.js` |

---

## File Structure

```
scripts/
├── monorepo-setup.ps1      # Main setup (PowerShell)
├── monorepo-setup.sh       # Main setup (Bash)
├── monorepo-setup.bat      # Main setup (CMD)
├── health-check.sh         # Diagnostics
├── run-all-tests.js        # Test runner
├── test-runner.js          # Comprehensive test suite
├── api-integration-test.js # API tests
├── google-fit-test.js      # Google Fit tests
├── performance-test.js     # Performance tests
├── README.md              # This file
├── SETUP_GUIDE.md         # Detailed setup docs
├── QUICKSTART.txt         # One-page reference
└── INDEX.md               # Scripts catalog (this file)
```

---

## Best Practices

1. **Always run `setup:clean` after:**
   - Pulling new changes with dependency updates
   - Switching git branches
   - Encountering npm errors
   - Before creating PRs

2. **Use `setup:rebuild` only if:**
   - You specifically need `workspace:*` protocol
   - Team has standardized on workspace protocol
   - Debugging protocol-specific issues

3. **Health checks before commits:**
   ```bash
   npm run health
   git status  # Should show no node_modules
   ```

4. **Testing workflow:**
   ```bash
   npm run setup:clean    # Ensure clean state
   npm run dev            # Start services
   node scripts/run-all-tests.js  # Validate
   ```

---

## Troubleshooting

### "Execution policy" error on Windows
```powershell
Set-ExecutionPolicy -Scope Process Bypass
```
Or run PowerShell as Administrator.

### Bash script not found (Windows)
Install WSL or Git Bash, or use the PowerShell version.

### Script hangs
The cleanup traverses the entire repo. Large node_modules may cause delays. Use `-SkipInstall` to only clean:
```bash
npm run setup:clean -- -SkipInstall
```

### npm install still fails after cleanup
Check Node.js version (needs >=18) and npm version (>=9):
```bash
node --version
npm --version
```

---

## Contributing

When adding new utility scripts:
1. Add entry to this `INDEX.md`
2. Add npm script shortcut to root `package.json` if appropriate
3. Document parameters and usage examples
4. Keep scripts platform-agnostic when possible (prefer bash)

---

**Last updated:** 2026-04-28
**Maintainer:** Monorepo Team
