# DJ Marcel - Système de gestion de soirées

Système de gestion de réservations de soirées avec architecture microservices pour DJ Marcel.

## Architecture

Le projet est divisé en 4 parties :

### Frontend (Next.js)
- **Port** : 3000
- **Dossier** : `front/`
- Page de réservation pour les clients
- Page de gestion pour DJ Marcel
- Interfaces pour gérer les playlists et soirées

### Microservices (Node.js/Express)

#### Service Clients
- **Port** : 3001
- **Dossier** : `services/clients/`
- Gestion CRUD des clients
- Stockage : `services/clients/data/clients.json`

#### Service Playlists
- **Port** : 3002
- **Dossier** : `services/playlists/`
- Gestion CRUD des playlists et styles musicaux
- Stockage : `services/playlists/data/playlists.json`

#### Service Soirées
- **Port** : 3003
- **Dossier** : `services/soirees/`
- Gestion CRUD des réservations de soirées
- Stockage : `services/soirees/data/soirees.json`

## Installation

### 1. Installer les dépendances du frontend

```powershell
cd front
npm install
```

### 2. Installer les dépendances des microservices

```powershell
# Service Clients
cd ..\services\clients
npm install

# Service Playlists
cd ..\playlists
npm install

# Service Soirées
cd ..\soirees
npm install
```

## Démarrage

Vous devez démarrer les 4 applications en parallèle (dans 4 terminaux différents) :

### Terminal 1 - Service Clients
```powershell
cd services\clients
npm start
```

### Terminal 2 - Service Playlists
```powershell
cd services\playlists
npm start
```

### Terminal 3 - Service Soirées
```powershell
cd services\soirees
npm start
```

### Terminal 4 - Frontend Next.js
```powershell
cd front
npm run dev
```

## Accès à l'application

Une fois tous les services démarrés :

- **Application web** : http://localhost:3000
  - Page d'accueil : http://localhost:3000
  - Réservation : http://localhost:3000/reserver
  - Espace DJ : http://localhost:3000/dj

- **APIs des microservices** :
  - Clients : http://localhost:3001/api/clients
  - Playlists : http://localhost:3002/api/playlists
  - Soirées : http://localhost:3003/api/soirees

## Fonctionnalités

### Page Réservation (`/reserver`)
- Créer un nouveau client ou sélectionner un client existant
- Réserver une soirée avec :
  - Date et lieu
  - Nombre d'invités
  - Budget
- Visualiser toutes les soirées réservées

### Page DJ Marcel (`/dj`)
- Visualiser toutes les soirées avec leurs détails
- Créer des playlists avec styles musicaux
- Assigner une playlist à une soirée
- Supprimer des playlists
- Voir les playlists assignées à chaque soirée

## API Endpoints

### Service Clients (Port 3001)
- `GET /api/clients` - Liste tous les clients
- `GET /api/clients/:id` - Récupère un client
- `POST /api/clients` - Crée un client
- `PUT /api/clients/:id` - Modifie un client
- `DELETE /api/clients/:id` - Supprime un client

### Service Playlists (Port 3002)
- `GET /api/playlists` - Liste toutes les playlists
- `GET /api/playlists/:id` - Récupère une playlist
- `POST /api/playlists` - Crée une playlist
- `PUT /api/playlists/:id` - Modifie une playlist
- `DELETE /api/playlists/:id` - Supprime une playlist

### Service Soirées (Port 3003)
- `GET /api/soirees` - Liste toutes les soirées
- `GET /api/soirees/:id` - Récupère une soirée
- `POST /api/soirees` - Crée une soirée
- `PUT /api/soirees/:id` - Modifie une soirée
- `DELETE /api/soirees/:id` - Supprime une soirée

## Modèles de données

### Client
```json
{
  "id": "string",
  "nom": "string",
  "email": "string",
  "telephone": "string",
  "createdAt": "ISO date"
}
```

### Playlist
```json
{
  "id": "string",
  "nom": "string",
  "stylesMusicaux": ["string"],
  "description": "string",
  "createdAt": "ISO date"
}
```

### Soirée
```json
{
  "id": "string",
  "clientId": "string",
  "date": "ISO date",
  "lieu": "string",
  "nombreInvites": "number",
  "playlistId": "string | null",
  "budget": "number",
  "statut": "string",
  "createdAt": "ISO date"
}
```

## Technologies utilisées

- **Frontend** : Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend** : Node.js, Express.js
- **Stockage** : Fichiers JSON
- **Communication** : REST API

## Développement

Pour le développement avec rechargement automatique :

```powershell
# Services
npm run dev

# Frontend
npm run dev
```
