# 🎵 DJ Marcel - Vue d'ensemble du projet

## Structure du projet

```
ARTHUR-NICOLAS/
│
├── front/                          # Frontend Next.js (Port 3000)
│   ├── app/
│   │   ├── page.tsx               # Page d'accueil
│   │   ├── reserver/
│   │   │   └── page.tsx           # Page réservation client
│   │   └── dj/
│   │       └── page.tsx           # Page DJ Marcel
│   ├── lib/
│   │   └── api/                   # Clients API pour microservices
│   │       ├── clients.ts
│   │       ├── playlists.ts
│   │       ├── soirees.ts
│   │       └── config.ts
│   └── package.json
│
├── services/                       # Microservices
│   ├── clients/                   # Service Clients (Port 3001)
│   │   ├── server.js
│   │   ├── package.json
│   │   └── data/
│   │       ├── clients.json
│   │       └── clients-exemple.json
│   │
│   ├── playlists/                 # Service Playlists (Port 3002)
│   │   ├── server.js
│   │   ├── package.json
│   │   └── data/
│   │       ├── playlists.json
│   │       └── playlists-exemple.json
│   │
│   └── soirees/                   # Service Soirées (Port 3003)
│       ├── server.js
│       ├── package.json
│       └── data/
│           ├── soirees.json
│           └── soirees-exemple.json
│
├── install.bat / install.ps1      # Scripts d'installation
├── start-all.bat / start-all.ps1  # Scripts de démarrage
├── load-sample-data.bat / .ps1    # Charger données d'exemple
└── INSTRUCTIONS.md                # Documentation complète

```

## 🎯 Flux de données

```
┌─────────────────────────────────────────────────────────┐
│                   UTILISATEUR                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│            FRONTEND NEXT.JS (Port 3000)                 │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Page       │  │   Page       │  │   Page       │  │
│  │  Accueil     │  │ Réservation  │  │  DJ Marcel   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         API Clients (lib/api/)                   │  │
│  │  - clients.ts                                    │  │
│  │  - playlists.ts                                  │  │
│  │  - soirees.ts                                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────┬──────────────┬──────────────┬────────────┘
              │              │              │
       HTTP   │       HTTP   │       HTTP   │
              ▼              ▼              ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   SERVICE     │  │   SERVICE     │  │   SERVICE     │
│   CLIENTS     │  │  PLAYLISTS    │  │   SOIRÉES     │
│  Port 3001    │  │  Port 3002    │  │  Port 3003    │
├───────────────┤  ├───────────────┤  ├───────────────┤
│  Express.js   │  │  Express.js   │  │  Express.js   │
│  REST API     │  │  REST API     │  │  REST API     │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                  │
   Read/Write         Read/Write         Read/Write
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ clients.json  │  │playlists.json │  │ soirees.json  │
└───────────────┘  └───────────────┘  └───────────────┘
```

## 📋 API Endpoints

### Service Clients (http://localhost:3001)
```
GET    /api/clients         # Liste tous les clients
GET    /api/clients/:id     # Récupère un client
POST   /api/clients         # Crée un client
PUT    /api/clients/:id     # Modifie un client
DELETE /api/clients/:id     # Supprime un client
```

### Service Playlists (http://localhost:3002)
```
GET    /api/playlists       # Liste toutes les playlists
GET    /api/playlists/:id   # Récupère une playlist
POST   /api/playlists       # Crée une playlist
PUT    /api/playlists/:id   # Modifie une playlist
DELETE /api/playlists/:id   # Supprime une playlist
```

### Service Soirées (http://localhost:3003)
```
GET    /api/soirees         # Liste toutes les soirées
GET    /api/soirees/:id     # Récupère une soirée
POST   /api/soirees         # Crée une soirée
PUT    /api/soirees/:id     # Modifie une soirée
DELETE /api/soirees/:id     # Supprime une soirée
```

## 🚀 Guide de démarrage

### 1️⃣ Installation
```bash
# Option A : Avec CMD (recommandé)
install.bat

# Option B : Avec PowerShell
.\install.ps1
```

### 2️⃣ Charger les données d'exemple (optionnel)
```bash
# Option A : Avec CMD
load-sample-data.bat

# Option B : Avec PowerShell
.\load-sample-data.ps1
```

### 3️⃣ Démarrage
```bash
# Option A : Avec CMD
start-all.bat

# Option B : Avec PowerShell
.\start-all.ps1
```

### 4️⃣ Accès à l'application
Ouvrez votre navigateur : **http://localhost:3000**

## 🎨 Captures d'écran des fonctionnalités

### Page d'accueil (/)
- Bouton "Réserver une soirée"
- Bouton "Espace DJ"

### Page Réservation (/reserver)
- Formulaire de réservation
  - Sélection/création de client
  - Date, lieu, nombre d'invités, budget
- Liste des soirées réservées en temps réel

### Page DJ Marcel (/dj)
- Liste de toutes les soirées
  - Affichage des détails (client, date, lieu, invités)
  - Indication de la playlist assignée
- Panneau de gestion des playlists
  - Création de nouvelles playlists
  - Assignation aux soirées
  - Suppression de playlists

## 🔧 Technologies utilisées

| Couche      | Technologie        | Version |
|-------------|-------------------|---------|
| Frontend    | Next.js           | 16.0.6  |
| UI          | React             | 19.2.0  |
| Styling     | Tailwind CSS      | 4.x     |
| Language    | TypeScript        | 5.x     |
| Backend     | Node.js + Express | Latest  |
| Storage     | JSON Files        | -       |
| Protocol    | REST API          | -       |

## ✅ Checklist des fonctionnalités

### Backend
- [x] Service Clients avec CRUD complet
- [x] Service Playlists avec CRUD complet
- [x] Service Soirées avec CRUD complet
- [x] Stockage persistant en JSON
- [x] CORS activé pour communication avec frontend

### Frontend
- [x] Page d'accueil avec navigation
- [x] Page réservation avec formulaire complet
- [x] Page DJ Marcel avec gestion des playlists
- [x] Communication avec les 3 microservices
- [x] Interface responsive avec Tailwind CSS
- [x] Gestion des erreurs

### DevOps
- [x] Scripts d'installation automatique
- [x] Scripts de démarrage multi-terminaux
- [x] Données d'exemple pré-configurées
- [x] Documentation complète

## 📝 Notes importantes

1. **Les 4 services doivent être démarrés** pour que l'application fonctionne
2. **Les ports 3000, 3001, 3002, 3003** doivent être libres
3. **Les données sont stockées dans des fichiers JSON** et persistent entre les redémarrages
4. **Pour réinitialiser les données**, supprimez les fichiers `*.json` ou rechargez les exemples

## 🎓 Objectif pédagogique

Ce projet démontre :
- ✅ Architecture microservices avec séparation des responsabilités
- ✅ Communication REST API entre services
- ✅ Frontend moderne avec Next.js et TypeScript
- ✅ Gestion d'état et fetch de données côté client
- ✅ Stockage persistant simple avec JSON
- ✅ Déploiement multi-services

---

**Projet créé pour DJ Marcel** 🎵
