# Système Event-Driven avec RabbitMQ

## 📋 Vue d'ensemble

Ce système implémente une architecture event-driven pour la génération automatique de playlists lors de la réservation d'une soirée.

## 🏗️ Architecture

```
┌─────────────────┐        ┌──────────────┐        ┌─────────────────┐
│  Service        │        │   RabbitMQ   │        │   Service       │
│  Soirées        │───────▶│   Message    │───────▶│   Playlists     │
│  (Producer)     │        │   Broker     │        │   (Consumer)    │
└─────────────────┘        └──────────────┘        └─────────────────┘
                                                            │
                                                            ▼
                                                    ┌───────────────┐
                                                    │ External API  │
                                                    │ lagmaster-pro │
                                                    └───────────────┘
```

## 🔄 Flux de données

1. **Création d'une soirée** : Un utilisateur réserve une soirée via l'API `/api/soirees`
2. **Publication** : Le service Soirées publie un message dans la queue RabbitMQ
3. **Consommation** : Le worker Playlists récupère le message de la queue
4. **Génération** : Le worker appelle l'API externe pour générer une playlist
5. **Sauvegarde** : La playlist générée est sauvegardée dans le service Playlists
6. **Mise à jour** : Le worker met à jour la soirée avec l'ID de la playlist générée (via Consul)

## 🛠️ Configuration

### RabbitMQ

- **Interface de management** : http://localhost:15672
- **Username** : admin
- **Password** : admin123
- **Port AMQP** : 5672
- **Port Management** : 15672

### Queue

- **Nom** : `playlist_generation_queue`
- **Durable** : Oui (les messages survivent au redémarrage)
- **Prefetch** : 1 (traite un message à la fois)

## 📨 Format des messages

```json
{
  "soireeId": "1234567890",
  "clientId": "client123",
  "style": "disco",
  "timestamp": "2025-12-02T10:30:00.000Z"
}
```

## 🎵 API Externe

- **URL** : https://lagmaster-pro.fly.dev/generate_playlist
- **Méthode** : GET
- **Timeout** : 90 secondes
- **Retry** : 3 tentatives avec délai de 10s

### Format de réponse

```json
{
  "style": "disco",
  "title": "Metaverse Collapse Disco",
  "tracks": [
    "Track 0 - Electric Pickles",
    "Track 1 - Disco Lemonade",
    "Track 2 - Techno Taco"
  ]
}
```

## ⚙️ Gestion des erreurs

### Stratégie de retry

- **Nombre maximum de tentatives** : 3
- **Délai entre tentatives** : 10 secondes
- **Timeout par requête** : 90 secondes

### Fallback

Si toutes les tentatives échouent, une playlist par défaut est générée :

```json
{
  "style": "disco",
  "title": "Disco Mix - Default",
  "tracks": [
    "Track 1 - disco Vibes",
    "Track 2 - disco Energy",
    "Track 3 - disco Dreams"
  ]
}
```

### Gestion des messages

- **Succès** : Le message est acquitté (`ack`)
- **Échec** : Le message est rejeté sans re-queue (`nack`)

## 🚀 Démarrage

```bash
# Démarrer tous les services
docker-compose up --build

# Vérifier les logs du worker
docker logs -f <container_id_playlists>
```

## 📊 Monitoring

### RabbitMQ Management UI

Accédez à http://localhost:15672 pour :
- Visualiser les queues
- Voir les messages en attente
- Monitorer les performances
- Gérer les connexions

### Logs

Le worker affiche des logs détaillés :

```
🚀 Démarrage du worker de génération de playlists...
✅ Worker connecté et en écoute sur la queue: playlist_generation_queue
⏳ En attente de messages...

📩 Message reçu pour soirée 1234567890
   Style: disco
   Client: client123
   Timestamp: 2025-12-02T10:30:00.000Z

🎵 Appel API externe (tentative 1/3) pour style: disco
✅ Playlist générée avec succès: Metaverse Collapse Disco
✅ Playlist 9876543210 créée et sauvegardée
   Titre: Metaverse Collapse Disco
   Tracks: 3
🔄 Mise à jour de la soirée 1234567890 avec playlist 9876543210
✅ Soirée 1234567890 mise à jour avec succès
✅ Message traité avec succès
```

## 🔐 Sécurité

- Les credentials RabbitMQ sont configurables via variables d'environnement
- Les messages sont persistants (survivent au redémarrage)
- Timeout et retry pour éviter les blocages

## 🧪 Test

### Créer une soirée

```bash
curl -X POST http://localhost:3003/api/soirees \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client123",
    "date": "2025-12-25",
    "lieu": "Paris",
    "nombreInvites": 50,
    "budget": 1000,
    "styleMusical": "disco"
  }'
```

### Vérifier les playlists générées

```bash
curl http://localhost:3002/api/playlists
```

## 📈 Performances

- **Traitement asynchrone** : Pas de blocage lors de la création de soirée
- **Resilience** : Retry automatique en cas d'échec
- **Scalabilité** : Possibilité d'ajouter plusieurs workers
- **Cache** : Les playlists sont sauvegardées localement
- **Mise à jour automatique** : La soirée est liée automatiquement à sa playlist via Consul service discovery

## 🐛 Troubleshooting

### Le worker ne démarre pas

```bash
# Vérifier que RabbitMQ est démarré
docker ps | grep rabbitmq

# Vérifier les logs RabbitMQ
docker logs rabbitmq-server
```

### L'API externe ne répond pas

Le système utilise automatiquement le fallback après 3 tentatives.

### Messages bloqués dans la queue

Accédez à l'interface RabbitMQ pour purger manuellement la queue si nécessaire.
