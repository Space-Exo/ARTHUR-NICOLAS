'use client';

import { useState, useEffect } from 'react';
import { soireesApi, Soiree } from '@/lib/api/soirees';
import { playlistsApi, Playlist } from '@/lib/api/playlists';
import { clientsApi, Client } from '@/lib/api/clients';

export default function DJPage() {
  const [soirees, setSoirees] = useState<Soiree[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSoiree, setSelectedSoiree] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistData, setNewPlaylistData] = useState({
    nom: '',
    description: '',
    stylesMusicaux: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [soireesData, playlistsData, clientsData] = await Promise.all([
        soireesApi.getAll(),
        playlistsApi.getAll(),
        clientsApi.getAll(),
      ]);
      setSoirees(soireesData);
      setPlaylists(playlistsData);
      setClients(clientsData);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPlaylist = async () => {
    if (!selectedSoiree || !selectedPlaylist) return;

    try {
      await soireesApi.update(selectedSoiree, { playlistId: selectedPlaylist });
      await loadData();
      setSelectedSoiree(null);
      setSelectedPlaylist('');
      alert('Playlist assignée avec succès !');
    } catch (err) {
      setError('Erreur lors de l\'assignation de la playlist');
      console.error(err);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const stylesMusicaux = newPlaylistData.stylesMusicaux
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      await playlistsApi.create({
        nom: newPlaylistData.nom,
        description: newPlaylistData.description,
        stylesMusicaux,
      });

      await loadData();
      setNewPlaylistData({ nom: '', description: '', stylesMusicaux: '' });
      setShowCreatePlaylist(false);
      alert('Playlist créée avec succès !');
    } catch (err) {
      setError('Erreur lors de la création de la playlist');
      console.error(err);
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette playlist ?')) return;

    try {
      await playlistsApi.delete(id);
      await loadData();
      alert('Playlist supprimée avec succès !');
    } catch (err) {
      setError('Erreur lors de la suppression de la playlist');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xl">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Espace DJ Marcel</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des soirées */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Soirées à venir</h2>
            <div className="space-y-4 max-h-[700px] overflow-y-auto">
              {soirees.length === 0 ? (
                <p className="text-gray-500">Aucune soirée réservée</p>
              ) : (
                soirees.map((soiree) => {
                  const client = clients.find((c) => c.id === soiree.clientId);
                  const playlist = playlists.find((p) => p.id === soiree.playlistId);
                  const isSelected = selectedSoiree === soiree.id;

                  return (
                    <div
                      key={soiree.id}
                      className={`border rounded p-4 cursor-pointer transition ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                      }`}
                      onClick={() => {
                        setSelectedSoiree(soiree.id);
                        setSelectedPlaylist(soiree.playlistId || '');
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{soiree.lieu}</h3>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                          {soiree.statut}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Date:</strong> {new Date(soiree.date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Client:</strong> {client?.nom || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Invités:</strong> {soiree.nombreInvites}
                      </p>
                      {playlist ? (
                        <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded">
                          <p className="text-sm font-medium text-purple-900">
                            🎵 Playlist: {playlist.nom}
                          </p>
                          <p className="text-xs text-purple-700">
                            {playlist.stylesMusicaux.join(', ')}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-orange-600">
                          ⚠️ Aucune playlist assignée
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Panneau de gestion des playlists */}
          <div className="space-y-6">
            {/* Assigner une playlist */}
            {selectedSoiree && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Assigner une playlist</h3>
                <select
                  value={selectedPlaylist}
                  onChange={(e) => setSelectedPlaylist(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                >
                  <option value="">Sélectionner une playlist</option>
                  {playlists.map((playlist) => (
                    <option key={playlist.id} value={playlist.id}>
                      {playlist.nom}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignPlaylist}
                  disabled={!selectedPlaylist}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  Assigner
                </button>
              </div>
            )}

            {/* Créer une playlist */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Playlists</h3>
                <button
                  onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}
                  className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 transition"
                >
                  {showCreatePlaylist ? 'Annuler' : '+ Nouvelle'}
                </button>
              </div>

              {showCreatePlaylist && (
                <form onSubmit={handleCreatePlaylist} className="mb-4 space-y-3 p-4 bg-gray-50 rounded">
                  <input
                    type="text"
                    placeholder="Nom de la playlist"
                    value={newPlaylistData.nom}
                    onChange={(e) => setNewPlaylistData({ ...newPlaylistData, nom: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Styles musicaux (séparés par des virgules)"
                    value={newPlaylistData.stylesMusicaux}
                    onChange={(e) => setNewPlaylistData({ ...newPlaylistData, stylesMusicaux: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newPlaylistData.description}
                    onChange={(e) => setNewPlaylistData({ ...newPlaylistData, description: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                    rows={2}
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition text-sm"
                  >
                    Créer
                  </button>
                </form>
              )}

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {playlists.length === 0 ? (
                  <p className="text-gray-500 text-sm">Aucune playlist</p>
                ) : (
                  playlists.map((playlist) => (
                    <div key={playlist.id} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{playlist.nom}</h4>
                        <button
                          onClick={() => handleDeletePlaylist(playlist.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {playlist.stylesMusicaux.join(', ')}
                      </p>
                      {playlist.description && (
                        <p className="text-xs text-gray-500">{playlist.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
