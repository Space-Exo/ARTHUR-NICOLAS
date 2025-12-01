@echo off
echo === Demarrage de DJ Marcel ===
echo.
echo Ouverture de 4 terminaux pour les services...
echo.

echo [1/4] Demarrage Service Clients (port 3001)...
start "Service Clients - Port 3001" cmd /k "cd services\clients && node server.js"

timeout /t 2 /nobreak >nul

echo [2/4] Demarrage Service Playlists (port 3002)...
start "Service Playlists - Port 3002" cmd /k "cd services\playlists && node server.js"

timeout /t 2 /nobreak >nul

echo [3/4] Demarrage Service Soirees (port 3003)...
start "Service Soirees - Port 3003" cmd /k "cd services\soirees && node server.js"

timeout /t 2 /nobreak >nul

echo [4/4] Demarrage Frontend Next.js (port 3000)...
start "Frontend Next.js - Port 3000" cmd /k "cd front && npm run dev"

echo.
echo === Tous les services ont ete lances ! ===
echo.
echo Accedez a l'application : http://localhost:3000
echo - Page d'accueil : http://localhost:3000
echo - Reservation : http://localhost:3000/reserver
echo - Espace DJ : http://localhost:3000/dj
echo.
echo Fermez les fenetres pour arreter les services.
echo.
pause
