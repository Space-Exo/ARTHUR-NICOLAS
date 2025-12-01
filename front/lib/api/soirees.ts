import API_BASE_URLS from './config';

export interface Soiree {
  id: string;
  clientId: string;
  date: string;
  lieu: string;
  nombreInvites: number;
  playlistId: string | null;
  budget: number;
  statut: string;
  createdAt?: string;
  updatedAt?: string;
}

export const soireesApi = {
  getAll: async (): Promise<Soiree[]> => {
    const res = await fetch(`${API_BASE_URLS.soirees}/api/soirees`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Erreur lors de la récupération des soirées');
    return res.json();
  },

  getById: async (id: string): Promise<Soiree> => {
    const res = await fetch(`${API_BASE_URLS.soirees}/api/soirees/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Soirée non trouvée');
    return res.json();
  },

  create: async (soiree: Omit<Soiree, 'id'>): Promise<Soiree> => {
    const res = await fetch(`${API_BASE_URLS.soirees}/api/soirees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(soiree),
    });
    if (!res.ok) throw new Error('Erreur lors de la création de la soirée');
    return res.json();
  },

  update: async (id: string, soiree: Partial<Soiree>): Promise<Soiree> => {
    const res = await fetch(`${API_BASE_URLS.soirees}/api/soirees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(soiree),
    });
    if (!res.ok) throw new Error('Erreur lors de la mise à jour de la soirée');
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URLS.soirees}/api/soirees/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression de la soirée');
  },
};
