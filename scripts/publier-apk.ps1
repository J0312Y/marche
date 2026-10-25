# Publie une nouvelle version de l'application pour les testeurs :
#   numéro de version +1, build production signé, copie sur le Bureau, mise en ligne sur
#   https://lamuka-market.lamuka-tech.com/tester (fichier dans /var/www/lamuka-market/site/app/)
# Usage : .\scripts\publier-apk.ps1            (nouvelle version)
#         .\scripts\publier-apk.ps1 -Notes "Correction du paiement"   (texte montré dans la fenêtre de mise à jour)
#         .\scripts\publier-apk.ps1 -Obligatoire   (les versions plus anciennes doivent se mettre à jour pour continuer)
#         .\scripts\publier-apk.ps1 -SansIncrement  (republier le même numéro)
# Les applications installées proposent la mise à jour d'elles-mêmes (GET /app-version, composant UpdatePrompt).
# Prérequis (hors du projet, jamais dans git) : C:\Users\<vous>\.lamuka\keys (clé de signature),
#   \.lamuka\jdk21 (Java), \.lamuka\vps (outils SSH, clé ~/.ssh/lamuka_vps)
param([switch]$SansIncrement, [switch]$SansEnvoi, [string]$Notes = "", [switch]$Obligatoire)
$ErrorActionPreference = 'Continue'  # les avertissements de vite/gradle sortent sur stderr : on vérifie les codes de retour
function Check($etape) { if ($LASTEXITCODE) { Write-Host "Échec : $etape" -ForegroundColor Red; exit 1 } }
$L = Join-Path $env:USERPROFILE '.lamuka'
$root = Split-Path $PSScriptRoot -Parent
$vf = Join-Path $root 'android\app\version.properties'
if (-not (Test-Path "$L\keys\keystore.properties")) { throw "Clé de signature introuvable : $L\keys\keystore.properties" }

# 1. Numéro de version
$v = @{}; Get-Content $vf | ForEach-Object { if ($_ -match '^(\w+)=(.*)$') { $v[$matches[1]] = $matches[2] } }
if (-not $SansIncrement) {
  $p = $v.VERSION_NAME.Split('.'); $p[-1] = [string]([int]$p[-1] + 1)
  $v.VERSION_CODE = [string]([int]$v.VERSION_CODE + 1); $v.VERSION_NAME = $p -join '.'
  [IO.File]::WriteAllText($vf, "VERSION_CODE=$($v.VERSION_CODE)`nVERSION_NAME=$($v.VERSION_NAME)`n")
}
Write-Host "Version $($v.VERSION_NAME) (code $($v.VERSION_CODE))"

# 2. Build production (serveur en ligne) + APK signé
Set-Location $root
npx vite build --mode production 2>&1 | Select-Object -Last 1; Check 'build du site'
npx cap sync android 2>&1 | Select-Object -Last 1; Check 'cap sync'
$env:JAVA_HOME = "$L\jdk21"
Set-Location android
.\gradlew.bat assembleRelease --no-daemon --console=plain -q
if ($LASTEXITCODE) { throw "échec du build Android" }
$apk = Join-Path $root 'android\app\build\outputs\apk\release\app-release.apk'
Set-Location $root

# 3. Copie sur le Bureau + fiche (version.json, QR code)
$out = Join-Path $env:TEMP 'lamuka-apk'; Remove-Item -Recurse -Force $out -ErrorAction SilentlyContinue
$env:APK_NOTES = $Notes; $env:APK_MIN = if ($Obligatoire) { $v.VERSION_CODE } else { "0" }
node "$L\vps\apk-meta.mjs" $apk $out $v.VERSION_NAME $v.VERSION_CODE
Copy-Item $apk "$env:USERPROFILE\Desktop\Lamuka-Market-$($v.VERSION_NAME).apk" -Force
Write-Host "Bureau : Lamuka-Market-$($v.VERSION_NAME).apk"
if ($SansEnvoi) { return }

# 4. Mise en ligne : nouvelle version, puis la fiche (les testeurs ne voient jamais un lien cassé)
$f = "lamuka-market-$($v.VERSION_NAME).apk"
node "$L\vps\run.mjs" "mkdir -p /var/www/lamuka-market/site/app"
node "$L\vps\put.mjs" (Join-Path $out $f) "/var/www/lamuka-market/site/app/$f"; Check 'envoi'
node "$L\vps\put.mjs" (Join-Path $out 'qr.svg') '/var/www/lamuka-market/site/app/qr.svg'; Check 'envoi'
node "$L\vps\put.mjs" (Join-Path $out 'version.json') '/var/www/lamuka-market/site/app/version.json'; Check 'envoi'
# on garde les 3 dernières versions
node "$L\vps\run.mjs" "cd /var/www/lamuka-market/site/app && ls -t lamuka-market-*.apk | tail -n +4 | xargs -r rm -f; chown -R www-data:www-data . && ls -la"
Write-Host "En ligne : https://lamuka-market.lamuka-tech.com/tester"




