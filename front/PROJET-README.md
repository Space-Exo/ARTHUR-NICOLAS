# 🎵 DJ Marcel - Système de gestion de soirées

Application complète avec architecture microservices pour gérer les réservations de soirées, les clients et les playlists.

## 🚀 Démarrage rapide

### Depuis le dossier parent (ARTHUR-NICOLAS)

#### Option 1 : Scripts automatiques (Recommandé)

**Installation** :
```bash
# Avec CMD
install.bat

# Ou avec PowerShell
.\install.ps1
```

**Démarrage** :
```bash
# Avec CMD
start-all.bat

# Ou avec PowerShell
.\start-all.ps1
```

#### Option 2 : Démarrage manuel

Ouvrez 4 terminaux et exécutez :

**Terminal 1 - Service Clients** :
```powershell
cd ..\services\clients
npm install
node server.js
```

**Terminal 2 - Service Playlists** :
```powershell
cd ..\services\playlists
npm install
node server.js
```

**Terminal 3 - Service Soirées** :
```powershell
cd ..\services\soirees
npm install
node server.js
```

**Terminal 4 - Frontend** :
```powershell
cd front
npm install
npm run dev
```

## 🌐 Accès à l'application

- **Application** : http://localhost:3000
  - Page d'accueil : http://localhost:3000
  - Réservation : http://localhost:3000/reserver
  - Espace DJ : http://localhost:3000/dj

## 📚 Architecture Microservices

```
┌─────────────────────────────────────────┐
│      Frontend Next.js (Port 3000)       │
│   - Page réservation                    │
│   - Page DJ Marcel                      │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Clients  │ │Playlists │ │ Soirées  │
│Port 3001 │ │Port 3002 │ │Port 3003 │
└──────────┘ └──────────┘ └──────────┘
     │            │            │
     ▼            ▼            ▼
[clients.json][playlists.json][soirees.json]
```

### Services

1. **Service Clients** (Port 3001)
   - Gestion CRUD des clients
   - Fichier : `../services/clients/data/clients.json`

2. **Service Playlists** (Port 3002)
   - Gestion CRUD des playlists et styles musicaux
   - Fichier : `../services/playlists/data/playlists.json`

3. **Service Soirées** (Port 3003)
   - Gestion CRUD des réservations
   - Fichier : `../services/soirees/data/soirees.json`

## ✨ Fonctionnalités

### Page Réservation (`/reserver`)
- ✅ Créer un nouveau client ou sélectionner un existant
- ✅ Réserver une soirée (date, lieu, budget, nombre d'invités)
- ✅ Visualiser toutes les soirées réservées

### Page DJ Marcel (`/dj`)
- ✅ Visualiser toutes les soirées avec détails
- ✅ Créer des playlists avec styles musicaux
- ✅ Assigner une playlist à une soirée
- ✅ Supprimer des playlists
- ✅ Voir les playlists assignées

## 🛠️ Technologies

- **Frontend** : Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend** : Node.js, Express.js
- **Stockage** : Fichiers JSON
- **Architecture** : Microservices REST API

## 📖 Documentation

Pour plus de détails, consultez [INSTRUCTIONS.md](../INSTRUCTIONS.md) dans le dossier parent.

## ⚠️ Prérequis

- Node.js 18+
- npm

---

Projet DJ Marcel 🎵 - Architecture Microservices
