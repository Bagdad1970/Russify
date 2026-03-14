import {type Playlist} from "../types/Playlist.ts";
import api from "./ApiClient.ts";
import type {PlaylistWithTracks} from "../types/PlaylistWithTracks.ts";

export class PlaylistManager {

    /*async create(playlist: PlaylistCreateRequest): Promise<Playlist> {
        try {
            const response = await api.post<Playlist>("playlists", playlist);
            return response.data;
        }
        catch (error) {
            console.error("Error creating playlist:", error);
            throw error;
        }
    }
    */

    async update(playlist: Playlist): Promise<Playlist> {
        try {
            const response = await api.put<Playlist>(`playlists/${playlist.id}`, playlist);
            return response.data;
        }
        catch (error) {
            console.error("Error updating playlist:", error);
            throw error;
        }
    }

    async findAll(): Promise<Playlist[]> {
        try {
            const response = await api.get<Playlist[]>("playlists");
            return response.data;
        }
        catch (error) {
            console.error("Error fetching playlists:", error);
            throw error;
        }
    }

    async findById(id: bigint): Promise<PlaylistWithTracks> {
        try {
            const response = await api.get<PlaylistWithTracks>(`playlists/${id}`);
            return response.data;
        }
        catch (error) {
            console.error("Error fetching Playlist by id:", error);
            throw error;
        }
    }

    async deleteById(id: bigint): Promise<void> {
        try {
            await api.delete(`playlists/${id}`);
        }
        catch (error) {
            console.error("Error deleting playlist by id:", error);
            throw error;
        }
    }

}