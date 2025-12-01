import { getConsulService } from '../consul';

// Cache pour les URLs découvertes via Consul
let cachedUrls: { clients: string; playlists: string; soirees: string } | null = null;
let lastFetch = 0;
const CACHE_TTL = 30000; // 30 secondes

/**
 * Récupère les URLs des services via Consul (côté serveur uniquement)
 */
export async function getServiceUrls() {
  // Utiliser le cache si toujours valide
  if (cachedUrls && Date.now() - lastFetch < CACHE_TTL) {
    return cachedUrls;
  }

  // Côté client, utiliser les URLs par défaut (localhost pour le browser)
  if (typeof window !== 'undefined') {
    return {
      clients: 'http://localhost:3001',
      playlists: 'http://localhost:3002',
      soirees: 'http://localhost:3003',
    };
  }

  // Côté serveur, découvrir via Consul
  try {
    const consul = getConsulService();
    const urls = await consul.getAllServiceUrls();
    cachedUrls = urls;
    lastFetch = Date.now();
    return urls;
  } catch (error) {
    console.error('❌ Erreur lors de la découverte des services:', error);
    // Fallback sur les noms de service Docker
    return {
      clients: 'http://service-clients:3001',
      playlists: 'http://service-playlists:3002',
      soirees: 'http://service-soirees:3003',
    };
  }
}

// Export pour compatibilité (utilise le cache ou fallback)
const API_BASE_URLS = {
  clients: 'http://localhost:3001',
  playlists: 'http://localhost:3002',
  soirees: 'http://localhost:3003',
};

export default API_BASE_URLS;

