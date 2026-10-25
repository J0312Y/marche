# (Le serveur le fait déjà tout seul chaque semaine : /root/tiles/maj-carte.sh, et l'app télécharge la nouvelle carte.
#  Ce script sert à mettre aussi la carte du jour DANS l'APK, avant de la publier.)
# Met à jour le fond de carte de Brazzaville avec les dernières données OpenStreetMap
# (après l'ajout de noms de rues, de commerces… sur openstreetmap.org : compter 1 à 2 jours avant qu'ils soient dans la carte).
#   1. extraction sur le VPS depuis la carte mondiale du jour (build.protomaps.com), zoom 15
#   2. copie dans l'application (public/tiles/bzv.pmtiles) : sera dans la prochaine APK (publier-apk.ps1)
#   3. mise en ligne pour le panneau (site/tiles/bzv.pmtiles), ancienne carte sauvegardée
# Usage : .\scripts\maj-carte.ps1   puis   .\scripts\publier-apk.ps1 -Notes "Carte mise à jour"
$ErrorActionPreference = 'Stop'
$L = Join-Path $env:USERPROFILE '.lamuka'
$root = Split-Path $PSScriptRoot -Parent
$bbox = '15.12,-4.37,15.37,-4.00'   # doit correspondre à BASEMAP_BOUNDS (src/utils/basemap.js, lamuka-admin/src/Basemap.jsx)
$cmd = "cd /root/tiles && for i in 0 1 2 3; do d=`$(date -d `"-`$i day`" +%Y%m%d); if curl -sfI https://build.protomaps.com/`$d.pmtiles >/dev/null; then echo carte du `$d; ./pmtiles extract https://build.protomaps.com/`$d.pmtiles bzv-new.pmtiles --bbox=$bbox --maxzoom=15 >/dev/null 2>&1 && break; fi; done; ls -la bzv-new.pmtiles"
node "$L\vps\run.mjs" $cmd
if ($LASTEXITCODE) { throw "échec de l'extraction" }
$tmp = Join-Path $env:TEMP 'bzv-new.pmtiles'
node "$L\vps\get.mjs" /root/tiles/bzv-new.pmtiles $tmp
if ((Get-Item $tmp).Length -lt 5MB) { throw "fichier de carte trop petit : extraction incomplète" }
Copy-Item $tmp (Join-Path $root 'public\tiles\bzv.pmtiles') -Force
node "$L\vps\run.mjs" "T=/var/www/lamuka-market/site/tiles/bzv.pmtiles; S=/root/backups/code/tiles-`$(date +%Y%m%d%H%M); mkdir -p `$S && cp `$T `$S/ && cp /root/tiles/bzv-new.pmtiles `$T.new && chown www-data:www-data `$T.new && mv `$T.new `$T && echo sauvegarde `$S && ls -la `$T"
# Date de la carte livrée avec l'app (= date du fichier en ligne) : l'app ne retélécharge que des cartes plus récentes
$ver = (Invoke-RestMethod "https://lamuka-market.lamuka-tech.com/api/v1/map-tiles").data.version
if ($ver) { [IO.File]::WriteAllText((Join-Path $root 'public\tiles\version.json'), "{`"version`": $ver}`n") }
Write-Host "Carte à jour (panneau en ligne). Pour l'application : .\scripts\publier-apk.ps1 -Notes `"Carte mise à jour`"" -ForegroundColor Green
