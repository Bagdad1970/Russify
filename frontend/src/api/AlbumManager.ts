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

    async create(album: any): Promise<Album> {
        const response = await api.post<Album>("albums", album);
        return response.data;
    }

    async update(album: Album): Promise<Album> {
        const response = await api.put<Album>(`albums/${album.id}`, album);
        return response.data;
    }

    async deleteById(id: bigint): Promise<void> {
        await api.delete(`albums/${id}`);
    }
}