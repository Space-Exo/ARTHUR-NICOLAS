# Script PowerShell pour installer les dépendances de tous les services

Write-Host "=== Installation des dépendances pour DJ Marcel ===" -ForegroundColor Green

# Service Clients
Write-Host "`n[1/4] Installation Service Clients..." -ForegroundColor Cyan
Set-Location "services\clients"
node (Get-Command npm).Source.Replace('npm.ps1', 'npm-cli.js') install
Set-Location "..\..\"

# Service Playlists
Write-Host "`n[2/4] Installation Service Playlists..." -ForegroundColor Cyan
Set-Location "services\playlists"
node (Get-Command npm).Source.Replace('npm.ps1', 'npm-cli.js') install
Set-Location "..\..\"

# Service Soirées
Write-Host "`n[3/4] Installation Service Soirées..." -ForegroundColor Cyan
Set-Location "services\soirees"
node (Get-Command npm).Source.Replace('npm.ps1', 'npm-cli.js') install
Set-Location "..\..\"

# Frontend
Write-Host "`n[4/4] Installation Frontend Next.js..." -ForegroundColor Cyan
Set-Location "front"
node (Get-Command npm).Source.Replace('npm.ps1', 'npm-cli.js') install
Set-Location "..\"

Write-Host "`n=== Installation terminée avec succès ! ===" -ForegroundColor Green
Write-Host "`nPour démarrer l'application, exécutez : .\start-all.ps1" -ForegroundColor Yellow
