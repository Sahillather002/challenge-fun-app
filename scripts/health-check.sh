#!/usr/bin/env bash
# Quick diagnostic check for monorepo health

echo "========================================"
echo "  Monorepo Health Check"
echo "========================================"

# Check Node/npm
echo ""
echo "[1] Node.js and npm versions:"
if command -v node &> /dev/null; then
    echo "  Node: $(node --version)"
else
    echo "  Node: NOT FOUND" >&2
fi

if command -v npm &> /dev/null; then
    echo "  npm:  $(npm --version)"
else
    echo "  npm:  NOT FOUND" >&2
fi

# Check workspace status
echo ""
echo "[2] npm workspaces:"
if [ -f "package.json" ]; then
    npm workspaces list 2>/dev/null || echo "  No workspaces found"
else
    echo "  No package.json in current directory"
fi

# Check for node_modules
echo ""
echo "[3] node_modules presence:"
if [ -d "node_modules" ]; then
    echo "  ROOT node_modules: EXISTS (should be cleaned)"
else
    echo "  ROOT node_modules: clean"
fi

WS_COUNT=0
BROKEN_WS=0
if [ -d "apps" ]; then
    for d in apps/*/; do
        [ -d "$d" ] || continue
        WS_NAME=$(basename "$d")
        if [ -d "$d/node_modules" ]; then
            echo "  $WS_NAME: has node_modules (can be cleaned)"
            WS_COUNT=$((WS_COUNT+1))
        fi
    done
fi

if [ $WS_COUNT -eq 0 ]; then
    echo "  All workspace node_modules: clean"
fi

# Check lock files
echo ""
echo "[4] Lock files:"
if [ -f "package-lock.json" ]; then
    echo "  ROOT package-lock.json: EXISTS"
else
    echo "  ROOT package-lock.json: missing (run npm install)"
fi

# Check workspace dependencies
echo ""
echo "[5] Workspace linking verification:"
npm ls @health-competition/shared --depth=0 2>/dev/null | head -5 || echo "  Shared package not properly linked"

echo ""
echo "========================================"
echo "  Done"
echo "========================================"
