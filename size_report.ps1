Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   MONOREPO SIZE REPORT 📊" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to calculate folder size
function Get-FolderSizeMB {
    param([string]$path)

    if (!(Test-Path $path)) {
        return 0
    }

    $bytes = (Get-ChildItem -Path $path -Recurse -Force `
            -ErrorAction SilentlyContinue |
        Measure-Object -Property Length -Sum).Sum

    return [math]::Round($bytes / 1MB, 2)
}

# Top-level folders only
$topFolders = Get-ChildItem -Directory -Force

$report = @()

foreach ($folder in $topFolders) {

    $sizeMB = Get-FolderSizeMB $folder.FullName

    $report += [PSCustomObject]@{
        Folder = $folder.Name
        SizeMB = $sizeMB
    }
}

# Sort by size
$report = $report | Sort-Object SizeMB -Descending

Write-Host ""
Write-Host "📌 Top-Level Folder Sizes:" -ForegroundColor Green
Write-Host "------------------------------------------" -ForegroundColor DarkGray

$report | Format-Table -AutoSize

# Total size
$totalSize = ($report | Measure-Object SizeMB -Sum).Sum

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "TOTAL MONOREPO SIZE: $totalSize MB" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 🔥 Special check for heavy redundant folders
$heavyTargets = @(
    "node_modules",
    ".expo",
    ".metro",
    ".turbo",
    "dist",
    "build",
    ".next"
)

Write-Host ""
Write-Host "🚨 Redundant Folder Scan (Biggest Offenders)" -ForegroundColor Red
Write-Host "------------------------------------------" -ForegroundColor DarkGray

$heavyReport = @()

foreach ($target in $heavyTargets) {

    $found = Get-ChildItem -Path . -Recurse -Directory -Force `
        -Filter $target -ErrorAction SilentlyContinue

    foreach ($dir in $found) {

        $sizeMB = Get-FolderSizeMB $dir.FullName

        $heavyReport += [PSCustomObject]@{
            Type   = $target
            Path   = $dir.FullName
            SizeMB = $sizeMB
        }
    }
}

if ($heavyReport.Count -eq 0) {
    Write-Host "✅ No redundant folders found!" -ForegroundColor Green
}
else {
    $heavyReport |
    Sort-Object SizeMB -Descending |
    Select-Object -First 15 |
    Format-Table -AutoSize
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   REPORT COMPLETE ✅" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
