@echo off
echo === Installation des dependances pour DJ Marcel ===
echo.

echo [1/4] Installation Service Clients...
cd services\clients
call npm install
cd ..\..

echo.
echo [2/4] Installation Service Playlists...
cd services\playlists
call npm install
cd ..\..

echo.
echo [3/4] Installation Service Soirees...
cd services\soirees
call npm install
cd ..\..

echo.
echo [4/4] Installation Frontend Next.js...
cd front
call npm install
cd ..

echo.
echo === Installation terminee avec succes ! ===
echo.
echo Pour demarrer l'application, executez : start-all.bat
pause
