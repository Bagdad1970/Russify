import { useState, useEffect } from 'react';
import { favoriteStore } from '../store/useFavoriteStore';

export const useFavorites = () => {
    const [favoriteTrackIds, setFavoriteTrackIds] = useState(favoriteStore.getFavoriteTrackIds());
    const [favoriteAlbumIds, setFavoriteAlbumIds] = useState(favoriteStore.getFavoriteAlbumIds());
    const [favoritePlaylistIds, setFavoritePlaylistIds] = useState(favoriteStore.getFavoritePlaylistIds());

    useEffect(() => {
        const unsubscribe = favoriteStore.subscribe(() => {
            setFavoriteTrackIds(new Set(favoriteStore.getFavoriteTrackIds()));
            setFavoriteAlbumIds(new Set(favoriteStore.getFavoriteAlbumIds()));
            setFavoritePlaylistIds(new Set(favoriteStore.getFavoritePlaylistIds()));
        });

        return unsubscribe;
    }, []);

    return {
        favoriteTrackIds,
        favoriteAlbumIds,
        favoritePlaylistIds,
        isTrackFavorite: (trackId: number) => favoriteStore.isTrackFavorite(trackId),
        isAlbumFavorite: (albumId: number) => favoriteStore.isAlbumFavorite(albumId),
        isPlaylistFavorite: (playlistId: number) => favoriteStore.isPlaylistFavorite(playlistId),
        addFavoriteTrack: (trackId: number) => favoriteStore.addFavoriteTrack(trackId),
        removeFavoriteTrack: (trackId: number) => favoriteStore.removeFavoriteTrack(trackId),
        addFavoriteAlbum: (albumId: number) => favoriteStore.addFavoriteAlbum(albumId),
        removeFavoriteAlbum: (albumId: number) => favoriteStore.removeFavoriteAlbum(albumId),
        addFavoritePlaylist: (playlistId: number) => favoriteStore.addFavoritePlaylist(playlistId),
        removeFavoritePlaylist: (playlistId: number) => favoriteStore.removeFavoritePlaylist(playlistId),
        loadFavorites: () => favoriteStore.loadFavorites()
    };
};