# Script PowerShell pour charger les données d'exemple

Write-Host "=== Chargement des données d'exemple ===" -ForegroundColor Green
Write-Host ""

Write-Host "Copie des données clients..." -ForegroundColor Cyan
Copy-Item "services\clients\data\clients-exemple.json" "services\clients\data\clients.json" -Force

Write-Host "Copie des données playlists..." -ForegroundColor Cyan
Copy-Item "services\playlists\data\playlists-exemple.json" "services\playlists\data\playlists.json" -Force

Write-Host "Copie des données soirées..." -ForegroundColor Cyan
Copy-Item "services\soirees\data\soirees-exemple.json" "services\soirees\data\soirees.json" -Force

Write-Host ""
Write-Host "=== Données d'exemple chargées avec succès ! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Vous pouvez maintenant démarrer l'application avec .\start-all.ps1" -ForegroundColor Yellow
