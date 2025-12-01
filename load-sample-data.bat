@echo off
echo === Chargement des donnees d'exemple ===
echo.

echo Copie des donnees clients...
copy /Y services\clients\data\clients-exemple.json services\clients\data\clients.json

echo Copie des donnees playlists...
copy /Y services\playlists\data\playlists-exemple.json services\playlists\data\playlists.json

echo Copie des donnees soirees...
copy /Y services\soirees\data\soirees-exemple.json services\soirees\data\soirees.json

echo.
echo === Donnees d'exemple chargees avec succes ! ===
echo.
echo Vous pouvez maintenant demarrer l'application avec start-all.bat
pause
