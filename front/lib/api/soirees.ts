import API_BASE_URLS, { getServiceUrls } from './config';

export interface Soiree {
  id: string;
  clientId: string;
  date: string;
  lieu: string;
  nombreInvites: number;
  playlistId: string | null;
  budget: number;
  statut: string;
  styleMusical?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const soireesApi = {
  getAll: async (): Promise<Soiree[]> => {
    const urls = await getServiceUrls();
    const res = await fetch(`${urls.soirees}/api/soirees`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Erreur lors de la récupération des soirées');
    return res.json();
  },

  getById: async (id: string): Promise<Soiree> => {
    const urls = await getServiceUrls();
    const res = await fetch(`${urls.soirees}/api/soirees/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Soirée non trouvée');
    return res.json();
  },

  create: async (soiree: Omit<Soiree, 'id'>): Promise<Soiree> => {
    const urls = await getServiceUrls();
    const res = await fetch(`${urls.soirees}/api/soirees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(soiree),
    });
    if (!res.ok) throw new Error('Erreur lors de la création de la soirée');
    return res.json();
  },

  update: async (id: string, soiree: Partial<Soiree>): Promise<Soiree> => {
    const urls = await getServiceUrls();
    const res = await fetch(`${urls.soirees}/api/soirees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(soiree),
    });
    if (!res.ok) throw new Error('Erreur lors de la mise à jour de la soirée');
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const urls = await getServiceUrls();
    const res = await fetch(`${urls.soirees}/api/soirees/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression de la soirée');
  },
};
