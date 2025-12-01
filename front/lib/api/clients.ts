import API_BASE_URLS from './config';

export interface Client {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  createdAt?: string;
  updatedAt?: string;
}

export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    const res = await fetch(`${API_BASE_URLS.clients}/api/clients`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Erreur lors de la récupération des clients');
    return res.json();
  },

  getById: async (id: string): Promise<Client> => {
    const res = await fetch(`${API_BASE_URLS.clients}/api/clients/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Client non trouvé');
    return res.json();
  },

  create: async (client: Omit<Client, 'id'>): Promise<Client> => {
    const res = await fetch(`${API_BASE_URLS.clients}/api/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if (!res.ok) throw new Error('Erreur lors de la création du client');
    return res.json();
  },

  update: async (id: string, client: Partial<Client>): Promise<Client> => {
    const res = await fetch(`${API_BASE_URLS.clients}/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if (!res.ok) throw new Error('Erreur lors de la mise à jour du client');
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URLS.clients}/api/clients/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression du client');
  },
};
