import api from "./ApiClient.ts";
import type { Track } from "../types/Track.ts";

export class TrackManager {
    async findAll(): Promise<Track[]> {
        try {
            const obj = {
                name: "",
                genre_ids: [
                ]
            }
            const response = await api.post<Track[]>("tracks/search", obj);
            return response.data;
        } catch (error) {
            console.error("Error fetching tracks:", error);
            throw error;
        }
    }

    async create(track: any): Promise<Track> {
        const response = await api.post<Track>("tracks", track);
        return response.data;
    }

    async update(track: Track): Promise<Track> {
        const response = await api.put<Track>(`tracks/${track.id}`, track);
        return response.data;
    }

    async deleteById(id: number | bigint): Promise<void> {
        await api.delete(`tracks/${id}`);
    }
}
