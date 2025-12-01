const API_BASE_URLS = {
  clients: process.env.NEXT_PUBLIC_CLIENTS_API || 'http://localhost:3001',
  playlists: process.env.NEXT_PUBLIC_PLAYLISTS_API || 'http://localhost:3002',
  soirees: process.env.NEXT_PUBLIC_SOIREES_API || 'http://localhost:3003',
};

export default API_BASE_URLS;
