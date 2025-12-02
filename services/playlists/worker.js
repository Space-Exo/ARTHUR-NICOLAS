import amqp from 'amqplib';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Consul from 'consul';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'data', 'playlists.json');
const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER || 'admin'}:${process.env.RABBITMQ_PASS || 'admin123'}@${process.env.RABBITMQ_HOST || 'rabbitmq'}:${process.env.RABBITMQ_PORT || '5672'}`;
const QUEUE_NAME = 'playlist_generation_queue';
const EXTERNAL_API_URL = 'https://lagmaster-pro.fly.dev/generate_playlist';
const MAX_RETRIES = 3;
const RETRY_DELAY = 10000; // 10 secondes

// Configuration Consul pour découvrir le service soirées
const consul = new Consul({
  host: process.env.CONSUL_HOST || 'consul',
  port: parseInt(process.env.CONSUL_PORT || '8500'),
});

// Fonction pour découvrir le service soirées via Consul
async function getSoireesServiceUrl() {
  try {
    const services = await consul.health.service({
      service: 'service-soirees',
      passing: true,
    });

    if (services.length === 0) {
      throw new Error('Service soirées non trouvé dans Consul');
    }

    const service = services[0].Service;
    return `http://${service.Address}:${service.Port}`;
  } catch (error) {
    console.warn('⚠️ Consul non disponible, utilisation URL par défaut');
    return 'http://service-soirees:3003';
  }
}

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

// Fonction pour appeler l'API externe avec retry
async function generatePlaylistFromAPI(style, retryCount = 0) {
  try {
    console.log(`🎵 Appel API externe (tentative ${retryCount + 1}/${MAX_RETRIES}) pour style: ${style}`);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000); // Timeout 90s

    const response = await fetch(EXTERNAL_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Playlist générée avec succès:', data.title);
    return data;

  } catch (error) {
    console.error(`❌ Erreur API (tentative ${retryCount + 1}):`, error.message);

    if (retryCount < MAX_RETRIES - 1) {
      console.log(`⏳ Retry dans ${RETRY_DELAY / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return generatePlaylistFromAPI(style, retryCount + 1);
    }

    // Si toutes les tentatives échouent, générer une playlist par défaut
    console.warn('⚠️ Génération de playlist par défaut après échec des tentatives');
    return {
      style: style,
      title: `${style.charAt(0).toUpperCase() + style.slice(1)} Mix - Default`,
      tracks: [
        `Track 1 - ${style} Vibes`,
        `Track 2 - ${style} Energy`,
        `Track 3 - ${style} Dreams`
      ]
    };
  }
}

// Fonction pour mettre à jour la soirée avec l'ID de la playlist
async function updateSoireeWithPlaylist(soireeId, playlistId) {
  try {
    const soireesServiceUrl = await getSoireesServiceUrl();
    const updateUrl = `${soireesServiceUrl}/api/soirees/${soireeId}`;

    console.log(`🔄 Mise à jour de la soirée ${soireeId} avec playlist ${playlistId}`);

    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistId: playlistId
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur mise à jour soirée: ${response.status}`);
    }

    const updatedSoiree = await response.json();
    console.log(`✅ Soirée ${soireeId} mise à jour avec succès`);
    return updatedSoiree;

  } catch (error) {
    console.error(`❌ Erreur mise à jour soirée ${soireeId}:`, error.message);
    // Ne pas bloquer si la mise à jour échoue
    return null;
  }
}

// Fonction pour traiter un message de la queue
async function processMessage(message) {
  const messageContent = JSON.parse(message.content.toString());
  const { soireeId, clientId, style, timestamp } = messageContent;

  console.log(`\n📩 Message reçu pour soirée ${soireeId}`);
  console.log(`   Style: ${style}`);
  console.log(`   Client: ${clientId}`);
  console.log(`   Timestamp: ${timestamp}`);

  try {
    // Générer la playlist via l'API externe
    const playlistData = await generatePlaylistFromAPI(style);

    // Sauvegarder la playlist dans le fichier JSON
    const playlists = await readPlaylists();
    const newPlaylist = {
      id: Date.now().toString(),
      nom: playlistData.title,
      stylesMusicaux: [playlistData.style],
      description: `Playlist générée automatiquement pour la soirée ${soireeId}`,
      tracks: playlistData.tracks,
      soireeId: soireeId,
      createdAt: new Date().toISOString()
    };

    playlists.push(newPlaylist);
    await writePlaylists(playlists);

    console.log(`✅ Playlist ${newPlaylist.id} créée et sauvegardée`);
    console.log(`   Titre: ${newPlaylist.nom}`);
    console.log(`   Tracks: ${newPlaylist.tracks.length}`);

    // Mettre à jour la soirée avec l'ID de la playlist générée
    await updateSoireeWithPlaylist(soireeId, newPlaylist.id);

    return true;
  } catch (error) {
    console.error('❌ Erreur lors du traitement du message:', error);
    throw error;
  }
}

// Fonction principale pour démarrer le worker
async function startWorker() {
  try {
    console.log('🚀 Démarrage du worker de génération de playlists...');
    console.log(`📡 Connexion à RabbitMQ: ${RABBITMQ_URL.replace(/:[^:]*@/, ':***@')}`);

    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.prefetch(1); // Traiter un message à la fois

    console.log(`✅ Worker connecté et en écoute sur la queue: ${QUEUE_NAME}`);
    console.log('⏳ En attente de messages...\n');

    channel.consume(QUEUE_NAME, async (message) => {
      if (message) {
        try {
          await processMessage(message);
          channel.ack(message); // Acquitter le message
          console.log('✅ Message traité avec succès\n');
        } catch (error) {
          console.error('❌ Erreur traitement, message rejeté:', error.message);
          channel.nack(message, false, false); // Rejeter le message
        }
      }
    });

    // Gestion de l'arrêt propre
    process.on('SIGINT', async () => {
      console.log('\n⚠️ Arrêt du worker...');
      await channel.close();
      await connection.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n⚠️ Arrêt du worker...');
      await channel.close();
      await connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erreur fatale du worker:', error.message);
    console.log('🔄 Tentative de reconnexion dans 5 secondes...');
    setTimeout(startWorker, 5000);
  }
}

// Démarrer le worker
startWorker();
