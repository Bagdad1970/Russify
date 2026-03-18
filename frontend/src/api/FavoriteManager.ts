import type {Track} from "../types/Track.ts";
import type {Album} from "../types/Album.ts";
import type {Playlist} from "../types/Playlist.ts";
import apiClient from "./ApiClient.ts";

export class FavoriteManager {
    async getFavoriteTracks(): Promise<Track[]> {
        try {
            const response = await apiClient.get<Track[]>("favorites/tracks");
            return response.data;
        } catch (error) {
            console.error("Error fetching favorite tracks:", error);
            throw error;
        }
    }

    async addFavoriteTrack(trackId: bigint): Promise<void> {
        try {
            await apiClient.post("favorites/tracks", { trackId: Number(trackId) });
        } catch (error) {
            console.error("Error adding favorite track:", error);
            throw error;
        }
    }

    async deleteFavoriteTrack(trackId: bigint): Promise<void> {
        try {
            await apiClient.delete(`favorites/tracks/${Number(trackId)}`);
        } catch (error) {
            console.error("Error deleting favorite track:", error);
            throw error;
        }
    }

    async getFavoriteAlbums(): Promise<Album[]> {
        try {
            const response = await apiClient.get<Album[]>("favorites/albums");
            return response.data;
        } catch (error) {
            console.error("Error fetching favorite albums:", error);
            throw error;
        }
    }

    async addFavoriteAlbum(albumId: bigint): Promise<void> {
        try {
            await apiClient.post("favorites/albums", { albumId: Number(albumId) });
        } catch (error) {
            console.error("Error adding favorite album:", error);
            throw error;
        }
    }

    async deleteFavoriteAlbum(albumId: bigint): Promise<void> {
        try {
            await apiClient.delete(`favorites/albums/${Number(albumId)}`);
        } catch (error) {
            console.error("Error deleting favorite album:", error);
            throw error;
        }
    }

    async getFavoritePlaylists(): Promise<Playlist[]> {
        try {
            const response = await apiClient.get<Playlist[]>("favorites/playlists");
            return response.data;
        } catch (error) {
            console.error("Error fetching favorite playlists:", error);
            throw error;
        }
    }

    async addFavoritePlaylist(playlistId: bigint): Promise<void> {
        try {
            await apiClient.post("favorites/playlists", { playlistId: Number(playlistId) });
        } catch (error) {
            console.error("Error adding favorite playlist:", error);
            throw error;
        }
    }

    async deleteFavoritePlaylist(playlistId: bigint): Promise<void> {
        try {
            await apiClient.delete(`favorites/playlists/${Number(playlistId)}`);
        } catch (error) {
            console.error("Error deleting favorite playlist:", error);
            throw error;
        }
    }
}