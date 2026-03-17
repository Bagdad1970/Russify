import { useState, useEffect } from 'react';
import { favoriteStore } from '../store/useFavoriteStore';

export const useFavorites = () => {
    const [favoriteTrackIds, setFavoriteTrackIds] = useState(favoriteStore.getFavoriteTrackIds());
    const [favoriteAlbumIds, setFavoriteAlbumIds] = useState(favoriteStore.getFavoriteAlbumIds());

    useEffect(() => {
        const unsubscribe = favoriteStore.subscribe(() => {
            setFavoriteTrackIds(new Set(favoriteStore.getFavoriteTrackIds()));
            setFavoriteAlbumIds(new Set(favoriteStore.getFavoriteAlbumIds()));
        });

        return unsubscribe;
    }, []);

    return {
        favoriteTrackIds,
        favoriteAlbumIds,
        isTrackFavorite: (trackId: number) => favoriteStore.isTrackFavorite(trackId),
        isAlbumFavorite: (albumId: number) => favoriteStore.isAlbumFavorite(albumId),
        addFavoriteTrack: (trackId: number) => favoriteStore.addFavoriteTrack(trackId),
        removeFavoriteTrack: (trackId: number) => favoriteStore.removeFavoriteTrack(trackId),
        addFavoriteAlbum: (albumId: number) => favoriteStore.addFavoriteAlbum(albumId),
        removeFavoriteAlbum: (albumId: number) => favoriteStore.removeFavoriteAlbum(albumId),
        loadFavorites: () => favoriteStore.loadFavorites()
    };
};