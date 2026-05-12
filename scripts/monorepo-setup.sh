#!/usr/bin/env bash
#
# Monorepo Clean & Install Script (Bash)
# Cross-platform version for Linux/macOS/WSL
#

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "========================================"
echo "  Monorepo Clean & Install Script"
echo "  Working directory: $ROOT_DIR"
echo "========================================"

# ============================================
# PHASE 1: Cleanup
# ============================================
echo ""
echo "[PHASE 1] Cleaning up..."

# Remove node_modules
echo "  Removing node_modules directories..."
find . -name "node_modules" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true

# Remove lock files
echo "  Removing lock files..."
find . -name "package-lock.json" -type f -delete 2>/dev/null || true
find . -name "yarn.lock" -type f -delete 2>/dev/null || true
find . -name "pnpm-lock.yaml" -type f -delete 2>/dev/null || true
find . -name "bun.lockb" -type f -delete 2>/dev/null || true

# Remove build artifacts
echo "  Removing build artifacts..."
rm -rf .next/ out/ coverage/ dist/ build/ 2>/dev/null || true
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true

# Remove Expo artifacts
echo "  Removing Expo artifacts..."
find . -name ".expo" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
find . -name "eas.json" -type f -delete 2>/dev/null || true
rm -rf ios/build/ android/build/ 2>/dev/null || true

# Remove Prisma artifacts
echo "  Removing Prisma artifacts..."
find . -path "*/prisma/migrations" -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
find . -path "*/prisma/*.db" -type f -delete 2>/dev/null || true
find . -path "*/prisma/*.sqlite" -type f -delete 2>/dev/null || true

# Remove cache directories
echo "  Removing cache directories..."
rm -rf .cache/ .eslintcache/ .turbo/ .parcel-cache/ 2>/dev/null || true

# Remove logs
echo "  Removing logs..."
find . -name "*.log" -type f -delete 2>/dev/null || true

# Clean npm cache
echo "  Cleaning npm cache..."
npm cache clean --force 2>/dev/null || true

echo "  Cleanup complete!"

# ============================================
# PHASE 2: Fix Workspace Protocols
# ============================================
echo ""
echo "[PHASE 2] Checking workspace dependency versions..."

WORKSPACE_PROTOCOL=false
if [ "$1" = "--workspace-protocol" ]; then
    WORKSPACE_PROTOCOL=true
    echo "  Keeping workspace:* protocol as-is"
else
    echo "  Converting workspace:* to ^1.0.0 for npm compatibility"

    # List of workspace package.json files to update
    WORKSPACE_PKGS=(
        "apps/mobile_3/package.json"
        "apps/web_2/package.json"
        "backends/nestjs-fitbattle/package.json"
        "apps/web/package.json"
        "apps/mobile/package.json"
    )

    for PKG in "${WORKSPACE_PKGS[@]}"; do
        if [ -f "$PKG" ]; then
            if grep -q '"workspace:\*"' "$PKG" 2>/dev/null; then
                sed -i '' 's/"workspace:\*"/"^1.0.0"/g' "$PKG" 2>/dev/null || sed -i 's/"workspace:\*"/"^1.0.0"/g' "$PKG"
                echo "  Updated $PKG"
            fi
        fi
    done

    # Fix root package.json build:web script
    if [ -f "package.json" ]; then
        if grep -q '"build:web".*apps/web' package.json 2>/dev/null; then
            sed -i '' 's/"build:web": "npm run build --workspace=apps\/web"/"build:web": "npm run build --workspace=apps\/web_2"/g' package.json 2>/dev/null || sed -i 's/"build:web": "npm run build --workspace=apps\/web"/"build:web": "npm run build --workspace=apps\/web_2"/g' package.json
            echo "  Fixed root package.json build:web script"
        fi
    fi
fi

# ============================================
# PHASE 3: Install Dependencies
# ============================================
echo ""
echo "[PHASE 3] Installing dependencies..."

# Remove root lockfile
if [ -f "package-lock.json" ]; then
    rm package-lock.json
    echo "  Removed root package-lock.json"
fi

# Install with legacy peer deps
echo "  Running: npm install --legacy-peer-deps --no-audit --no-fund"
npm install --legacy-peer-deps --no-audit --no-fund

# ============================================
# PHASE 4: Verification
# ============================================
echo ""
echo "[PHASE 4] Verifying installation..."

echo ""
echo "  Workspace dependency tree:"
npm ls @health-competition/shared --depth=0 2>/dev/null || true

echo ""
echo "  All workspaces:"
npm workspaces list 2>/dev/null || true

echo ""
echo "========================================"
echo "  Installation Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Verify the monorepo is working:"
echo "     npm run build:web"
echo "     npm run dev:mobile"
echo "     npm run dev:nest"
echo ""
echo "  2. Start all development servers:"
echo "     npm run dev"
echo ""
echo "  3. Build all packages:"
echo "     npm run build"
echo ""
