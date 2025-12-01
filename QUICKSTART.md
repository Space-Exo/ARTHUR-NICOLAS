# 🚀 Guide de démarrage rapide - DJ Marcel

## ⚡ Option 1 : Démarrage automatique (Recommandé)

### Étape 1 : Installation
Double-cliquez sur **`install.bat`** (ou exécutez `.\install.ps1` dans PowerShell)

### Étape 2 : Données d'exemple (optionnel)
Double-cliquez sur **`load-sample-data.bat`** pour avoir des données de démonstration

### Étape 3 : Démarrage
Double-cliquez sur **`start-all.bat`** (ou exécutez `.\start-all.ps1` dans PowerShell)

### Étape 4 : Accès
Ouvrez votre navigateur sur **http://localhost:3000**

---

## 🐳 Option 2 : Avec Docker (Alternative)

Si vous avez Docker installé :

```bash
docker-compose up --build
```

Puis accédez à **http://localhost:3000**

---

## 🛠️ Option 3 : Démarrage manuel

### Terminal 1 - Service Clients
```powershell
cd services\clients
npm install
node server.js
```

### Terminal 2 - Service Playlists
```powershell
cd services\playlists
npm install
node server.js
```

### Terminal 3 - Service Soirées
```powershell
cd services\soirees
npm install
node server.js
```

### Terminal 4 - Frontend
```powershell
cd front
npm install
npm run dev
```

---

## 📍 URLs d'accès

| Service         | URL                           |
|----------------|-------------------------------|
| **Application** | http://localhost:3000         |
| Réservation    | http://localhost:3000/reserver |
| Espace DJ      | http://localhost:3000/dj       |
| API Clients    | http://localhost:3001/api/clients |
| API Playlists  | http://localhost:3002/api/playlists |
| API Soirées    | http://localhost:3003/api/soirees |

---

## ❓ Problèmes courants

### Les scripts .bat ne fonctionnent pas
- Essayez les scripts .ps1 avec PowerShell
- Ou utilisez le démarrage manuel

### Un port est déjà utilisé
- Vérifiez qu'aucun autre service n'utilise les ports 3000-3003
- Fermez les anciens terminaux/services

### Erreur d'installation npm
- Vérifiez que Node.js est installé : `node --version`
- Version recommandée : Node.js 18 ou supérieur

---

## 📚 Documentation complète

- **OVERVIEW.md** : Vue d'ensemble du projet
- **INSTRUCTIONS.md** : Documentation détaillée
- **PROJET-README.md** : Guide du frontend

Bon développement ! 🎵
