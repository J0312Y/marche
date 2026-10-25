# Publie le site vitrine sur https://lamuka-market.lamuka-tech.com
# Le dossier /app/ du serveur (APK des testeurs, publié par publier-apk.ps1) n'est jamais effacé.
$ErrorActionPreference = 'Continue'  # les avertissements de vite/gradle sortent sur stderr : on vérifie les codes de retour
function Check($etape) { if ($LASTEXITCODE) { Write-Host "Échec : $etape" -ForegroundColor Red; exit 1 } }
$L = Join-Path $env:USERPROFILE '.lamuka'
$root = Split-Path $PSScriptRoot -Parent
$tmp = Join-Path $env:TEMP 'lamuka-site'; Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue; New-Item -ItemType Directory $tmp | Out-Null
Set-Location (Join-Path $root 'website')
$env:VITE_API_URL = '/api/v1'
npx vite build --outDir (Join-Path $tmp 'site') --emptyOutDir 2>&1 | Select-Object -Last 1; Check 'build du site'
Set-Location $tmp; tar -czf site.tgz site
node "$L\vps\put.mjs" (Join-Path $tmp 'site.tgz') /root/lamuka-deploy/site.tgz; Check 'envoi'
node "$L\vps\run.mjs" "cd /root/lamuka-deploy && rm -rf site && tar -xzf site.tgz && rsync -a --delete --exclude /app/ --exclude /tiles/ site/ /var/www/lamuka-market/site/ && chown -R www-data:www-data /var/www/lamuka-market/site && find /var/www/lamuka-market/site -type d -exec chmod 755 {} + && find /var/www/lamuka-market/site -type f -exec chmod 644 {} + && echo publié"
Set-Location $root


