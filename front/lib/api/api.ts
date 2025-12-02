
import { Client, clientsApi } from "./clients";
import { Playlist, playlistsApi } from "./playlists";
import { Soiree, soireesApi } from "./soirees";

export const getAllClient = async (): Promise<Client[]> => 
{
    return await clientsApi.getAll();
}

export const getAllSoiree = async (): Promise<Soiree[]> => 
{
    return await soireesApi.getAll();
}

export const getAllPlaylist = async (): Promise<Playlist[]> => 
{
    return await playlistsApi.getAll();
}

export const createPlaylist = async (playlist: Omit<Playlist, 'id'>): Promise<Playlist> => 
{
    return await playlistsApi.create(playlist);
}

export const deletePlaylist = async (id: string): Promise<void> => 
{
    return await playlistsApi.delete(id);
}

export const updateSoiree = async (id: string, soiree: Partial<Soiree>): Promise<Soiree> => 
{
    return await soireesApi.update(id, soiree);
}

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => 
{
    return await clientsApi.create(client);
}

export const createSoiree = async (soiree: Omit<Soiree, 'id'>): Promise<Soiree> => 
{
    return await soireesApi.create(soiree);
}