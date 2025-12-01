import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;
const DATA_FILE = path.join(__dirname, 'data', 'playlists.json');

app.use(cors());
app.use(express.json());

// Fonction pour lire les playlists
async function readPlaylists() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Fonction pour écrire les playlists
async function writePlaylists(playlists) {
  await fs.writeFile(DATA_FILE, JSON.stringify(playlists, null, 2));
}

// GET - Récupérer toutes les playlists
app.get('/api/playlists', async (req, res) => {
  try {
    const playlists = await readPlaylists();
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des playlists' });
  }
});

// GET - Récupérer une playlist par ID
app.get('/api/playlists/:id', async (req, res) => {
  try {
    const playlists = await readPlaylists();
    const playlist = playlists.find(p => p.id === req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist non trouvée' });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la playlist' });
  }
});

// POST - Créer une nouvelle playlist
app.post('/api/playlists', async (req, res) => {
  try {
    const playlists = await readPlaylists();
    const newPlaylist = {
      id: Date.now().toString(),
      nom: req.body.nom,
      stylesMusicaux: req.body.stylesMusicaux || [],
      description: req.body.description || '',
      createdAt: new Date().toISOString()
    };
    playlists.push(newPlaylist);
    await writePlaylists(playlists);
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la playlist' });
  }
});

// PUT - Mettre à jour une playlist
app.put('/api/playlists/:id', async (req, res) => {
  try {
    const playlists = await readPlaylists();
    const index = playlists.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Playlist non trouvée' });
    }
    playlists[index] = {
      ...playlists[index],
      nom: req.body.nom || playlists[index].nom,
      stylesMusicaux: req.body.stylesMusicaux || playlists[index].stylesMusicaux,
      description: req.body.description !== undefined ? req.body.description : playlists[index].description,
      updatedAt: new Date().toISOString()
    };
    await writePlaylists(playlists);
    res.json(playlists[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la playlist' });
  }
});

// DELETE - Supprimer une playlist
app.delete('/api/playlists/:id', async (req, res) => {
  try {
    const playlists = await readPlaylists();
    const filteredPlaylists = playlists.filter(p => p.id !== req.params.id);
    if (playlists.length === filteredPlaylists.length) {
      return res.status(404).json({ error: 'Playlist non trouvée' });
    }
    await writePlaylists(filteredPlaylists);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la playlist' });
  }
});

app.listen(PORT, () => {
  console.log(`Service Playlists démarré sur le port ${PORT}`);
});
