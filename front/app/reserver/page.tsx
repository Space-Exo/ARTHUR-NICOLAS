'use client';

import { useState, useEffect } from 'react';
import { Client } from '@/lib/api/clients';
import { Soiree } from '@/lib/api/soirees';
import { Playlist } from '@/lib/api/playlists';
import { createClient, createSoiree, getAllClient, getAllSoiree, getAllPlaylist } from '@/lib/api/api';

export default function ReserverPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [soirees, setSoirees] = useState<Soiree[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        clientNom: '',
        clientEmail: '',
        clientTelephone: '',
        date: '',
        lieu: '',
        nombreInvites: '',
        budget: '',
        styleMusical: 'disco',
    });

    const [selectedClientId, setSelectedClientId] = useState<string>('new');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const clientsData: Client[] = await getAllClient();
            const soireesData: Soiree[] = await getAllSoiree();
            const playlistsData: Playlist[] = await getAllPlaylist();
            setClients(clientsData);
            setSoirees(soireesData);
            setPlaylists(playlistsData);
        } catch (err) {
            setError('Erreur lors du chargement des données');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            let clientId = selectedClientId;

            // Créer un nouveau client si nécessaire
            if (selectedClientId === 'new') {
                const newClient = await createClient({
                    nom: formData.clientNom,
                    email: formData.clientEmail,
                    telephone: formData.clientTelephone,
                });
                clientId = newClient.id;
            }

            // Créer la réservation
            await createSoiree({
                clientId,
                date: formData.date,
                lieu: formData.lieu,
                nombreInvites: parseInt(formData.nombreInvites),
                budget: parseFloat(formData.budget),
                playlistId: null,
                statut: 'confirmée',
                styleMusical: formData.styleMusical,
            });

            // Réinitialiser le formulaire et recharger les données
            setFormData({
                clientNom: '',
                clientEmail: '',
                clientTelephone: '',
                date: '',
                lieu: '',
                nombreInvites: '',
                budget: '',
                styleMusical: 'disco',
            });
            setSelectedClientId('new');
            await loadData();
            setSuccessMessage('Réservation créée avec succès ! La playlist sera générée automatiquement dans quelques instants.');
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err) {
            setError('Erreur lors de la création de la réservation');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen p-8">
                <div className="max-w-6xl mx-auto">
                    <p className="text-xl">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-black">Réserver une soirée</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {successMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulaire de réservation */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-black">Nouvelle réservation</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Sélection client */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Client</label>
                                <select
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(e.target.value)}
                                    className="w-full p-2 border rounded text-black"
                                    required
                                >
                                    <option value="new">Nouveau client</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.nom} ({client.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Informations nouveau client */}
                            {selectedClientId === 'new' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-black">Nom</label>
                                        <input
                                            type="text"
                                            value={formData.clientNom}
                                            onChange={(e) => setFormData({ ...formData, clientNom: e.target.value })}
                                            className="w-full p-2 border rounded text-black"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-black">Email</label>
                                        <input
                                            type="email"
                                            value={formData.clientEmail}
                                            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                            className="w-full p-2 border rounded text-black"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-black">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={formData.clientTelephone}
                                            onChange={(e) => setFormData({ ...formData, clientTelephone: e.target.value })}
                                            className="w-full p-2 border rounded text-black"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {/* Informations soirée */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full p-2 border rounded text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Lieu</label>
                                <input
                                    type="text"
                                    value={formData.lieu}
                                    onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                                    className="w-full p-2 border rounded text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Nombre d'invités</label>
                                <input
                                    type="number"
                                    value={formData.nombreInvites}
                                    onChange={(e) => setFormData({ ...formData, nombreInvites: e.target.value })}
                                    className="w-full p-2 border rounded text-black"
                                    required
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Budget (€)</label>
                                <input
                                    type="number"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    className="w-full p-2 border rounded text-black text-black"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">Style musical</label>
                                <select
                                    value={formData.styleMusical}
                                    onChange={(e) => setFormData({ ...formData, styleMusical: e.target.value })}
                                    className="w-full p-2 border rounded text-black"
                                    required
                                >
                                    <option value="disco">Disco</option>
                                    <option value="rock">Rock</option>
                                    <option value="jazz">Jazz</option>
                                    <option value="pop">Pop</option>
                                    <option value="electronic">Electronic</option>
                                    <option value="hip-hop">Hip-Hop</option>
                                    <option value="classical">Classical</option>
                                    <option value="reggae">Reggae</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    🎵 Une playlist sera générée automatiquement pour ce style
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                            >
                                Réserver
                            </button>
                        </form>
                    </div>

                    {/* Liste des soirées */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-black">Soirées réservées</h2>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto">
                            {soirees.length === 0 ? (
                                <p className="text-gray-500">Aucune soirée réservée</p>
                            ) : (
                                soirees.filter((soiree) => {
                                    if (selectedClientId !== 'new') {
                                        return soiree.clientId === selectedClientId && new Date(soiree.date) >= new Date();
                                    }
                                }).map((soiree) => {
                                    const client = clients.find((c) => c.id === soiree.clientId);
                                    const associatedPlaylist = playlists.find((p) => p.soireeId === soiree.id);
                                    return (
                                        <div key={soiree.id} className="border rounded p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-black">{soiree.lieu}</h3>
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
                                            <p className="text-sm text-gray-600">
                                                <strong>Budget:</strong> {soiree.budget}€
                                            </p>
                                            {soiree.styleMusical && (
                                                <p className="text-sm text-gray-600">
                                                    <strong>Style:</strong> {soiree.styleMusical}
                                                </p>
                                            )}
                                            {associatedPlaylist ? (
                                                <div className="mt-3 pt-3 border-t">
                                                    <p className="text-sm font-semibold text-green-600 mb-1">
                                                        ✓ Playlist générée: {associatedPlaylist.nom}
                                                    </p>
                                                    {associatedPlaylist.tracks && associatedPlaylist.tracks.length > 0 && (
                                                        <ul className="text-xs text-gray-500 ml-4 list-disc">
                                                            {associatedPlaylist.tracks.slice(0, 3).map((track, idx) => (
                                                                <li key={idx}>{track}</li>
                                                            ))}
                                                            {associatedPlaylist.tracks.length > 3 && (
                                                                <li className="italic">
                                                                    +{associatedPlaylist.tracks.length - 3} autres morceaux
                                                                </li>
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="mt-3 pt-3 border-t">
                                                    <p className="text-sm text-yellow-600">
                                                        ⏳ Playlist en cours de génération...
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
