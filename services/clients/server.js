import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Consul from 'consul';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.SERVICE_PORT || 3001;
const SERVICE_NAME = process.env.SERVICE_NAME || 'service-clients';
const DATA_FILE = path.join(__dirname, 'data', 'clients.json');

// Configuration Consul
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

// Fonction pour lire les clients
async function readClients() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Fonction pour écrire les clients
async function writeClients(clients) {
  await fs.writeFile(DATA_FILE, JSON.stringify(clients, null, 2));
}

// GET - Récupérer tous les clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await readClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
  }
});

// GET - Récupérer un client par ID
app.get('/api/clients/:id', async (req, res) => {
  try {
    const clients = await readClients();
    const client = clients.find(c => c.id === req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du client' });
  }
});

// POST - Créer un nouveau client
app.post('/api/clients', async (req, res) => {
  try {
    const clients = await readClients();
    const newClient = {
      id: Date.now().toString(),
      nom: req.body.nom,
      email: req.body.email,
      telephone: req.body.telephone,
      createdAt: new Date().toISOString()
    };
    clients.push(newClient);
    await writeClients(clients);
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du client' });
  }
});

// PUT - Mettre à jour un client
app.put('/api/clients/:id', async (req, res) => {
  try {
    const clients = await readClients();
    const index = clients.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    clients[index] = {
      ...clients[index],
      nom: req.body.nom || clients[index].nom,
      email: req.body.email || clients[index].email,
      telephone: req.body.telephone || clients[index].telephone,
      updatedAt: new Date().toISOString()
    };
    await writeClients(clients);
    res.json(clients[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du client' });
  }
});

// DELETE - Supprimer un client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const clients = await readClients();
    const filteredClients = clients.filter(c => c.id !== req.params.id);
    if (clients.length === filteredClients.length) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    await writeClients(filteredClients);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du client' });
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
  console.log(`Service Clients démarré sur le port ${PORT}`);
  await registerService();
});
