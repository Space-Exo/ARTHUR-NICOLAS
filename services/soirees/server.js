import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Consul from 'consul';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.SERVICE_PORT || 3003;
const SERVICE_NAME = process.env.SERVICE_NAME || 'service-soirees';
const DATA_FILE = path.join(__dirname, 'data', 'soirees.json');

// Configuration C
const consul = new Consul({
      host: process.env.CONSUL_HOST || 'consul',
      port: parseInt(process.env.CONSUL_PORT || '8500'),
});

app.use(cors());
app.use(express.json());

// Health check endpoint pour Consul
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: SERVICE_NAME });
});

// Fonction pour lire les soirées
async function readSoirees() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Fonction pour écrire les soirées
async function writeSoirees(soirees) {
  await fs.writeFile(DATA_FILE, JSON.stringify(soirees, null, 2));
}

// GET - Récupérer toutes les soirées
app.get('/api/soirees', async (req, res) => {
  try {
    const soirees = await readSoirees();
    res.json(soirees);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des soirées' });
  }
});

// GET - Récupérer une soirée par ID
app.get('/api/soirees/:id', async (req, res) => {
  try {
    const soirees = await readSoirees();
    const soiree = soirees.find(s => s.id === req.params.id);
    if (!soiree) {
      return res.status(404).json({ error: 'Soirée non trouvée' });
    }
    res.json(soiree);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la soirée' });
  }
});

// POST - Créer une nouvelle soirée (réservation)
app.post('/api/soirees', async (req, res) => {
  try {
    const soirees = await readSoirees();
    const newSoiree = {
      id: Date.now().toString(),
      clientId: req.body.clientId,
      date: req.body.date,
      lieu: req.body.lieu,
      nombreInvites: req.body.nombreInvites,
      playlistId: req.body.playlistId || null,
      budget: req.body.budget || 0,
      statut: req.body.statut || 'confirmée',
      createdAt: new Date().toISOString()
    };
    soirees.push(newSoiree);
    await writeSoirees(soirees);
    res.status(201).json(newSoiree);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la soirée' });
  }
});

// PUT - Mettre à jour une soirée
app.put('/api/soirees/:id', async (req, res) => {
  try {
    const soirees = await readSoirees();
    const index = soirees.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Soirée non trouvée' });
    }
    soirees[index] = {
      ...soirees[index],
      clientId: req.body.clientId || soirees[index].clientId,
      date: req.body.date || soirees[index].date,
      lieu: req.body.lieu || soirees[index].lieu,
      nombreInvites: req.body.nombreInvites || soirees[index].nombreInvites,
      playlistId: req.body.playlistId !== undefined ? req.body.playlistId : soirees[index].playlistId,
      budget: req.body.budget !== undefined ? req.body.budget : soirees[index].budget,
      statut: req.body.statut || soirees[index].statut,
      updatedAt: new Date().toISOString()
    };
    await writeSoirees(soirees);
    res.json(soirees[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la soirée' });
  }
});

// DELETE - Supprimer une soirée
app.delete('/api/soirees/:id', async (req, res) => {
  try {
    const soirees = await readSoirees();
    const filteredSoirees = soirees.filter(s => s.id !== req.params.id);
    if (soirees.length === filteredSoirees.length) {
      return res.status(404).json({ error: 'Soirée non trouvée' });
    }
    await writeSoirees(filteredSoirees);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la soirée' });
  }
});

// Enregistrement dans Consul
async function registerService() {
  const serviceId = `${SERVICE_NAME}-${PORT}`;
  const registration = {
    id: serviceId,
    name: SERVICE_NAME,
    address: SERVICE_NAME,
    port: parseInt(PORT),
    check: {
      http: `http://${SERVICE_NAME}:${PORT}/health`,
      interval: '10s',
      timeout: '5s',
    },
    tags: ['api', 'microservice', 'dj-marcel'],
  };

  try {
    await consul.agent.service.register(registration);
    console.log(`✅ Service ${SERVICE_NAME} enregistré dans Consul`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'enregistrement dans Consul:`, error.message);
  }
}

// Désenregistrement de Consul à l'arrêt
async function deregisterService() {
  const serviceId = `${SERVICE_NAME}-${PORT}`;
  try {
    await consul.agent.service.deregister(serviceId);
    console.log(`✅ Service ${SERVICE_NAME} désenregistré de Consul`);
  } catch (error) {
    console.error(`❌ Erreur lors du désenregistrement:`, error.message);
  }
}

// Gestion de l'arrêt propre
process.on('SIGINT', async () => {
  await deregisterService();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await deregisterService();
  process.exit(0);
});

app.listen(PORT, async () => {
  console.log(`Service Soirées démarré sur le port ${PORT}`);
  await registerService();
});
