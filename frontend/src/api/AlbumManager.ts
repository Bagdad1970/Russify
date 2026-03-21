import api from "./ApiClient.ts";
import type { Album } from "../types/Album.ts";
import { AlbumStatus } from "../types/AlbumStatus.ts";

const toFormData = (payload: Record<string, unknown>): FormData => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, String(item)));
            return;
        }

        formData.append(key, value instanceof Blob ? value : String(value));
    });

    return formData;
};

export class AlbumManager {
    async findAll(): Promise<Album[]> {
        const response = await api.get<Album[]>("albums");
        return response.data;
    }

    async findAllTrackById(id: bigint | number): Promise<Album> {
        const response = await api.get<Album>(`albums/${id}`);
        return response.data;
    }

    async findAllManaged(): Promise<Album[]> {
        const response = await api.get<Album[]>("albums/admin/all");
        return response.data;
    }

    async findModerationQueue(): Promise<Album[]> {
        const response = await api.get<Album[]>("albums/moderation");
        return response.data;
    }

    async create(album: FormData | Record<string, unknown>): Promise<Album> {
        const response = await api.post<Album>("albums", album, {
            headers: album instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined
        });
        return response.data;
    }

    async update(album: Album | FormData): Promise<Album> {
        const id = album instanceof FormData ? album.get("id") : album.id;
        const payload = album instanceof FormData ? album : toFormData(album as unknown as Record<string, unknown>);
        const response = await api.put<Album>(`albums/${id}`, payload, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    }

    async updateAlbumMultipart(album: Album): Promise<Album> {
        return this.update(album);
    }

    async moderate(id: number | bigint, status: AlbumStatus): Promise<Album> {
        const formData = new FormData();
        formData.append("id", String(id));
        formData.append("status", status);
        const response = await api.put<Album>(`albums/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    }

    async deleteById(id: number | bigint): Promise<void> {
        await api.delete(`albums/${id}`);
    }
}
