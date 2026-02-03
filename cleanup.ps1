$deleteFolders = @(
    "node_modules",
    ".expo",
    ".metro",
    ".turbo",
    "dist",
    "build"
)

$ignorePaths = @(
    ".git",
    "uploads"   # keeps backend uploads safe
)

foreach ($folder in $deleteFolders) {

    $found = Get-ChildItem -Path . -Recurse -Directory -Force `
        -Filter $folder -ErrorAction SilentlyContinue

    foreach ($dir in $found) {

        # Skip ignored folders
        $skip = $false
        foreach ($ignore in $ignorePaths) {
            if ($dir.FullName -match $ignore) {
                $skip = $true
            }
        }

        if ($skip) { continue }

        Write-Host "Deleting: $($dir.FullName)" -ForegroundColor Red
        Remove-Item -Recurse -Force $dir.FullName -ErrorAction SilentlyContinue
    }
}

Write-Host "Cleanup finished ✅" -ForegroundColor Green
