import Consul from 'consul';

class ConsulService {
  constructor() {
    this.consul = new Consul({
      host: process.env.CONSUL_HOST || 'localhost',
      port: process.env.CONSUL_PORT || '8500',
      promisify: true,
    });
  }

  /**
   * Enregistre un service dans Consul
   * @param {string} serviceName - Nom du service
   * @param {number} servicePort - Port du service
   * @param {string} serviceId - ID unique du service
   */
  async registerService(serviceName, servicePort, serviceId) {
    const registration = {
      id: serviceId || `${serviceName}-${servicePort}`,
      name: serviceName,
      address: process.env.SERVICE_HOST || 'localhost',
      port: servicePort,
      check: {
        http: `http://${process.env.SERVICE_HOST || 'localhost'}:${servicePort}/health`,
        interval: '10s',
        timeout: '5s',
      },
      tags: ['api', 'microservice', 'dj-marcel'],
    };

    try {
      await this.consul.agent.service.register(registration);
      console.log(`✅ Service ${serviceName} enregistré dans Consul sur le port ${servicePort}`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'enregistrement du service ${serviceName}:`, error.message);
    }
  }

  /**
   * Désenregistre un service de Consul
   * @param {string} serviceId - ID du service à désenregistrer
   */
  async deregisterService(serviceId) {
    try {
      await this.consul.agent.service.deregister(serviceId);
      console.log(`✅ Service ${serviceId} désenregistré de Consul`);
    } catch (error) {
      console.error(`❌ Erreur lors du désenregistrement du service ${serviceId}:`, error.message);
    }
  }

  /**
   * Découvre un service dans Consul
   * @param {string} serviceName - Nom du service à découvrir
   * @returns {Promise<Object>} - Informations sur le service
   */
  async discoverService(serviceName) {
    try {
      const services = await this.consul.health.service({
        service: serviceName,
        passing: true,
      });

      if (services.length === 0) {
        throw new Error(`Service ${serviceName} non trouvé dans Consul`);
      }

      // Retourne le premier service disponible (load balancing simple)
      const service = services[0].Service;
      return {
        address: service.Address,
        port: service.Port,
        url: `http://${service.Address}:${service.Port}`,
      };
    } catch (error) {
      console.error(`❌ Erreur lors de la découverte du service ${serviceName}:`, error.message);
      throw error;
    }
  }

  /**
   * Liste tous les services enregistrés
   * @returns {Promise<Object>} - Liste des services
   */
  async listServices() {
    try {
      const services = await this.consul.catalog.service.list();
      return services;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des services:', error.message);
      throw error;
    }
  }

  /**
   * Obtient l'URL d'un service via Consul
   * @param {string} serviceName - Nom du service
   * @returns {Promise<string>} - URL du service
   */
  async getServiceUrl(serviceName) {
    try {
      const service = await this.discoverService(serviceName);
      return service.url;
    } catch (error) {
      // Fallback sur les URLs par défaut si Consul n'est pas disponible
      const fallbackUrls = {
        'service-clients': 'http://localhost:3001',
        'service-playlists': 'http://localhost:3002',
        'service-soirees': 'http://localhost:3003',
      };
      console.warn(`⚠️  Consul non disponible, utilisation de l'URL par défaut pour ${serviceName}`);
      return fallbackUrls[serviceName] || 'http://localhost:3000';
    }
  }
}

export default ConsulService;
