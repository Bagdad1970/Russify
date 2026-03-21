import {type Playlist} from "../types/Playlist.ts";
import type {Track} from "../types/Track.ts"
import api from "./ApiClient.ts";
import type {PlaylistWithTracks} from "../types/PlaylistWithTracks.ts";

export class PlaylistManager {
    async create(playlist: FormData | Record<string, unknown>): Promise<Playlist> {
        try {
            const response = await api.post<Playlist>("playlists", playlist, {
                headers: playlist instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined
            });
            return response.data;
        }
        catch (error) {
            console.error("Error creating playlist:", error);
            throw error;
        }
    }

    async createMultipart(formData: FormData): Promise<Playlist> {
        return this.create(formData);
    }

    async addTrackToPlaylist(playlistId: number | bigint, trackId: number): Promise<void> {
        try {
            await api.post(`playlists/${playlistId}/tracks`, {
                track_id: trackId
            });
        } catch (error) {
            console.error('Error adding track to playlist:', error);
            throw error;
        }
    }

    async removeTrackFromPlaylist(playlistId: number | bigint, trackId: number): Promise<void> {
        try {
            await api.delete(`playlists/${playlistId}/${trackId}`);
        } catch (error) {
            console.error('Error removing track from playlist:', error);
            throw error;
        }
    }

    async findTracksByPlaylistId(id: number | bigint): Promise<Track[]> {
        try {
            const response = await api.get<Track[]>(`playlists/${id}/tracks`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching tracks for playlist ${id}:`, error);
            throw error;
        }
    }

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

    async findById(id: number | bigint): Promise<PlaylistWithTracks> {
        try {
            const response = await api.get<PlaylistWithTracks>(`playlists/${id}`);
            return response.data;
        }
        catch (error) {
            console.error("Error fetching Playlist by id:", error);
            throw error;
        }
    }

    async deleteById(id: number | bigint): Promise<void> {
        try {
            await api.delete(`playlists/${id}`);
        }
        catch (error) {
            console.error("Error deleting playlist by id:", error);
            throw error;
        }
    }

}
