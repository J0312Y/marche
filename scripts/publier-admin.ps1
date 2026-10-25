# Publie le panneau d'administration sur https://lamuka-market.lamuka-tech.com/admin/
$ErrorActionPreference = 'Continue'  # les avertissements de vite sortent sur stderr : on vérifie les codes de retour
function Check($etape) { if ($LASTEXITCODE) { Write-Host "Échec : $etape" -ForegroundColor Red; exit 1 } }
$L = Join-Path $env:USERPROFILE '.lamuka'
$root = Split-Path $PSScriptRoot -Parent
$tmp = Join-Path $env:TEMP 'lamuka-admin'; Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue; New-Item -ItemType Directory $tmp | Out-Null
Set-Location (Join-Path $root 'lamuka-admin')
$env:VITE_API_URL = '/api/v1'
npx vite build --base /admin/ --outDir (Join-Path $tmp 'admin') --emptyOutDir 2>&1 | Select-Object -Last 1; Check 'build du panneau'
Set-Location $tmp; tar -czf admin.tgz admin
node "$L\vps\put.mjs" (Join-Path $tmp 'admin.tgz') /root/lamuka-deploy/admin.tgz; Check 'envoi'
node "$L\vps\run.mjs" "cd /root/lamuka-deploy && rm -rf admin && tar -xzf admin.tgz && rsync -a --delete admin/ /var/www/lamuka-market/admin/ && chown -R www-data:www-data /var/www/lamuka-market/admin && find /var/www/lamuka-market/admin -type d -exec chmod 755 {} + && find /var/www/lamuka-market/admin -type f -exec chmod 644 {} + && echo publié"
Set-Location $root
