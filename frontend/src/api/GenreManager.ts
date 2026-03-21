import api from "./ApiClient.ts";
import type {Genre} from "../types/Genre";
import type {GenreCreateRequest} from "../types/request/GenreCreateRequest";

export class GenreManager {

    async create(genre: GenreCreateRequest): Promise<Genre> {
        try {
            const response = await api.post<Genre>("genres", genre);
            return response.data;
        }
        catch (error) {
            console.error("Error creating genre:", error);
            throw error;
        }
    }

    async update(genre: Genre): Promise<Genre> {
        try {
            const response = await api.put<Genre>(`genres/${genre.id}`, genre);
            return response.data;
        }
        catch (error) {
            console.error("Error updating genre:", error);
            throw error;
        }
    }

    async findAll(): Promise<Genre[]> {
        try {
            const response = await api.get<Genre[]>("genres");
            return response.data;
        }
        catch (error) {
            console.error("Error fetching genres:", error);
            throw error;
        }
    }

    async findById(id: number | bigint): Promise<Genre> {
        try {
            const response = await api.get<Genre>(`genres/${id}`);
            return response.data;
        }
        catch (error) {
            console.error("Error fetching Genre by id:", error);
            throw error;
        }
    }

    async deleteById(id: number | bigint): Promise<void> {
        try {
            await api.delete(`genres/${id}`);
        }
        catch (error) {
            console.error("Error deleting genre:", error);
            throw error;
        }
    }

}
