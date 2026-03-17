import apiClient from "./ApiClient.ts";
import type { Album } from "../types/Album.ts";

export class UserManager {
    async getUserAlbums(): Promise<Album[]> {
        try {
            const response = await apiClient.get<Album[]>("user/albums");
            return response.data;
        } catch (error) {
            console.error("Error fetching user albums:", error);
            throw error;
        }
    }
}