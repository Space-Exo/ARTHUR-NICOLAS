# Script PowerShell pour démarrer tous les services

Write-Host "=== Démarrage de DJ Marcel ===" -ForegroundColor Green
Write-Host "`nOuverture de 4 terminaux pour les services...`n" -ForegroundColor Yellow

# Chemin de base
$basePath = $PWD.Path

# Démarrer le service Clients
Write-Host "[1/4] Démarrage Service Clients (port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\services\clients'; Write-Host 'Service Clients - Port 3001' -ForegroundColor Green; node server.js"

Start-Sleep -Seconds 1

# Démarrer le service Playlists
Write-Host "[2/4] Démarrage Service Playlists (port 3002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\services\playlists'; Write-Host 'Service Playlists - Port 3002' -ForegroundColor Green; node server.js"

Start-Sleep -Seconds 1

# Démarrer le service Soirées
Write-Host "[3/4] Démarrage Service Soirées (port 3003)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\services\soirees'; Write-Host 'Service Soirées - Port 3003' -ForegroundColor Green; node server.js"

Start-Sleep -Seconds 1

# Démarrer le frontend Next.js
Write-Host "[4/4] Démarrage Frontend Next.js (port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\front'; Write-Host 'Frontend Next.js - Port 3000' -ForegroundColor Green; node (Get-Command npm).Source.Replace('npm.ps1', 'npm-cli.js') run dev"

Write-Host "`n=== Tous les services ont été lancés ! ===" -ForegroundColor Green
Write-Host "`nAccédez à l'application : http://localhost:3000" -ForegroundColor Yellow
Write-Host "- Page d'accueil : http://localhost:3000" -ForegroundColor White
Write-Host "- Réservation : http://localhost:3000/reserver" -ForegroundColor White
Write-Host "- Espace DJ : http://localhost:3000/dj" -ForegroundColor White
Write-Host "`nFermez les fenêtres PowerShell pour arrêter les services.`n" -ForegroundColor Gray
