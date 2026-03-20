import api from "./ApiClient.ts";
import type { Album } from "../types/Album.ts";

export class AlbumManager {
    async findAll(): Promise<Album[]> {
        try {
            const response = await api.get<Album[]>("albums");
            return response.data;
        } catch (error) {
            console.error("Error fetching albums:", error);
            throw error;
        }
    }

    async findAllTrackById(id: bigint | number): Promise<Album> {
        const response = await api.get<Album>(`albums/${id}`);
        return response.data;
    }


    async create(album: any): Promise<Album> {
        const response = await api.post<Album>("albums", album);
        return response.data;
    }

    async updateAlbumMultipart(album: Album): Promise<Album> {
        const formData = new FormData();

        formData.append('title', album.title);

        if (album.authorId) {
            formData.append('authorId', String(album.authorId));
        }

        if (album.typeId) {
            formData.append('typeId', String(album.typeId));
        }

        if (album.releasedAt) {
            formData.append('releasedAt', new Date(album.releasedAt).toISOString());
        }

        formData.append('status', album.status || 'IN_PROGRESS');

        const trackIds = album.trackIds || (album as any).tracks?.map((t: any) => t.id) || [];

        if (Array.isArray(trackIds)) {
            trackIds.forEach((id: number) => {
                formData.append('trackIds', String(id));
            });
        }

        const API_URL = import.meta.env.VITE_BASE_URL_PROD || import.meta.env.VITE_BASE_URL_DEV || 'http://localhost:8080';
        const token = localStorage.getItem('auth_token');

        try {
            const response = await fetch(`${API_URL}/api/albums/${album.id}`, {
                method: 'PUT',
                headers: token ? {
                    'Authorization': `Bearer ${token}`,
                    // Content-Type НЕ указываем вручную, браузер сам поставит multipart/form-data с boundary
                } : {},
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error ${response.status}: ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            return contentType?.includes('application/json')
                ? await response.json()
                : album; // Возвращаем локальные данные, если сервер ничего не вернул

        } catch (error) {
            console.error('Error updating album via multipart:', error);
            throw error;
        }
    }

    async deleteById(id: bigint): Promise<void> {
        await api.delete(`albums/${id}`);
    }
}