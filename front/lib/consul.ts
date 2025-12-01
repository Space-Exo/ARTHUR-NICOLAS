import Consul from 'consul';

class ConsulServiceDiscovery {
  private static instance: ConsulServiceDiscovery;
  private consul: any;
  private cache: Map<string, { url: string; timestamp: number }>;
  private cacheTTL: number = 30000; // 30 secondes

  private constructor() {
    this.consul = new Consul({
      host: process.env.CONSUL_HOST || 'consul',
      port: parseInt(process.env.CONSUL_PORT || '8500'),
    });
    this.cache = new Map();
  }

  public static getInstance(): ConsulServiceDiscovery {
    if (!ConsulServiceDiscovery.instance) {
      ConsulServiceDiscovery.instance = new ConsulServiceDiscovery();
    }
    return ConsulServiceDiscovery.instance;
  }

  /**
   * Découvre un service dans Consul
   */
  async discoverService(serviceName: string): Promise<string> {
    // Vérifier le cache
    const cached = this.cache.get(serviceName);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.url;
    }

    try {
      const services = await this.consul.health.service({
        service: serviceName,
        passing: true,
      });

      if (services.length === 0) {
        throw new Error(`Service ${serviceName} non trouvé dans Consul`);
      }

      // Sélection aléatoire pour load balancing simple
      const service = services[Math.floor(Math.random() * services.length)].Service;
      const url = `http://${service.Address}:${service.Port}`;

      // Mise en cache
      this.cache.set(serviceName, { url, timestamp: Date.now() });

      console.log(`✅ Service ${serviceName} découvert: ${url}`);
      return url;
    } catch (error: any) {
      console.error(`❌ Erreur lors de la découverte du service ${serviceName}:`, error.message);
      
      // Fallback sur les URLs par défaut (nom du service Docker)
      const fallbackUrls: Record<string, string> = {
        'service-clients': 'http://service-clients:3001',
        'service-playlists': 'http://service-playlists:3002',
        'service-soirees': 'http://service-soirees:3003',
      };

      const fallbackUrl = fallbackUrls[serviceName] || 'http://localhost:3000';
      console.warn(`⚠️ Utilisation de l'URL de fallback pour ${serviceName}: ${fallbackUrl}`);
      return fallbackUrl;
    }
  }

  /**
   * Récupère les URLs de tous les services
   */
  async getAllServiceUrls() {
    const [clientsUrl, playlistsUrl, soireesUrl] = await Promise.all([
      this.discoverService('service-clients'),
      this.discoverService('service-playlists'),
      this.discoverService('service-soirees'),
    ]);

    return {
      clients: clientsUrl,
      playlists: playlistsUrl,
      soirees: soireesUrl,
    };
  }

  /**
   * Efface le cache
   */
  clearCache() {
    this.cache.clear();
  }
}

export function getConsulService(): ConsulServiceDiscovery {
  return ConsulServiceDiscovery.getInstance();
}

export default ConsulServiceDiscovery;
