import API_BASE_URLS, { getServiceUrls } from './config';

export interface Playlist {
  id: string;
  nom: string;
  stylesMusicaux: string[];
  description: string;
  tracks?: string[];
  soireeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const playlistsApi = {
  getAll: async (): Promise<Playlist[]> => {
    const urls = await getServiceUrls();
    const res = await fetch(`${urls.playlists}/api/playlists`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Erreur lors de la récupération des playlists');
    return res.json();
  },

  getById: async (id: string): Promise<Playlist> => {
    const urls = await getServiceUrls();
    const res = await fetch(`${urls.playlists}/api/playlists/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Playlist non trouvée');
    return res.json();
  },

  create: async (playlist: Omit<Playlist, 'id'>): Promise<Playlist> => {
    const urls = await getServiceUrls();
    const res = await fetch(`${urls.playlists}/api/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playlist),
    });
    if (!res.ok) throw new Error('Erreur lors de la création de la playlist');
    return res.json();
  },

  update: async (id: string, playlist: Partial<Playlist>): Promise<Playlist> => {
    const urls = await getServiceUrls();
    const res = await fetch(`${urls.playlists}/api/playlists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playlist),
    });
    if (!res.ok) throw new Error('Erreur lors de la mise à jour de la playlist');
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const urls = await getServiceUrls();
    const res = await fetch(`${urls.playlists}/api/playlists/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression de la playlist');
  },
};
