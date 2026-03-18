import { FavoriteManager } from '../api/FavoriteManager';
import type { Track } from '../types/Track';
import type { Album } from '../types/Album';
import type { Playlist } from '../types/Playlist';

class FavoriteStore {
    private static instance: FavoriteStore;
    private favoriteTrackIds: Set<number> = new Set();
    private favoriteAlbumIds: Set<number> = new Set();
    private favoritePlaylistIds: Set<number> = new Set();
    private listeners: Set<() => void> = new Set();
    private favoriteManager = new FavoriteManager();

    static getInstance(): FavoriteStore {
        if (!FavoriteStore.instance) {
            FavoriteStore.instance = new FavoriteStore();
        }
        return FavoriteStore.instance;
    }

    getFavoriteTrackIds(): Set<number> {
        return this.favoriteTrackIds;
    }

    getFavoriteAlbumIds(): Set<number> {
        return this.favoriteAlbumIds;
    }

    getFavoritePlaylistIds(): Set<number> {
        return this.favoritePlaylistIds;
    }

    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        this.listeners.forEach(listener => listener());
    }

    async loadFavorites() {
        try {
            const [tracks, albums, playlists] = await Promise.all([
                this.favoriteManager.getFavoriteTracks(),
                this.favoriteManager.getFavoriteAlbums(),
                this.favoriteManager.getFavoritePlaylists()
            ]);

            this.favoriteTrackIds = new Set(tracks.map(track => Number(track.id)));
            this.favoriteAlbumIds = new Set(albums.map(album => Number(album.id)));
            this.favoritePlaylistIds = new Set(playlists.map(playlist => Number(playlist.id)));

            this.notify();
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    }

    async addFavoriteTrack(trackId: number) {
        try {
            await this.favoriteManager.addFavoriteTrack(BigInt(trackId));
            this.favoriteTrackIds.add(trackId);
            this.notify();
        } catch (error) {
            console.error('Error adding favorite track:', error);
        }
    }

    async removeFavoriteTrack(trackId: number) {
        try {
            await this.favoriteManager.deleteFavoriteTrack(BigInt(trackId));
            this.favoriteTrackIds.delete(trackId);
            this.notify();
        } catch (error) {
            console.error('Error removing favorite track:', error);
        }
    }

    async addFavoriteAlbum(albumId: number) {
        try {
            await this.favoriteManager.addFavoriteAlbum(BigInt(albumId));
            this.favoriteAlbumIds.add(albumId);
            this.notify();
        } catch (error) {
            console.error('Error adding favorite album:', error);
        }
    }

    async removeFavoriteAlbum(albumId: number) {
        try {
            await this.favoriteManager.deleteFavoriteAlbum(BigInt(albumId));
            this.favoriteAlbumIds.delete(albumId);
            this.notify();
        } catch (error) {
            console.error('Error removing favorite album:', error);
        }
    }

    async addFavoritePlaylist(playlistId: number) {
        try {
            await this.favoriteManager.addFavoritePlaylist(BigInt(playlistId));
            this.favoritePlaylistIds.add(playlistId);
            this.notify();
        } catch (error) {
            console.error('Error adding favorite playlist:', error);
        }
    }

    async removeFavoritePlaylist(playlistId: number) {
        try {
            await this.favoriteManager.deleteFavoritePlaylist(BigInt(playlistId));
            this.favoritePlaylistIds.delete(playlistId);
            this.notify();
        } catch (error) {
            console.error('Error removing favorite playlist:', error);
        }
    }

    // --- Checks ---
    isTrackFavorite(trackId: number): boolean {
        return this.favoriteTrackIds.has(trackId);
    }

    isAlbumFavorite(albumId: number): boolean {
        return this.favoriteAlbumIds.has(albumId);
    }

    isPlaylistFavorite(playlistId: number): boolean {
        return this.favoritePlaylistIds.has(playlistId);
    }
}

export const favoriteStore = FavoriteStore.getInstance();