import api from "./ApiClient.ts";
import type { Author } from "../types/Author.ts";

export class AuthorManager {
    async findAll(): Promise<Author[]> {
        try {
            const response = await api.get<Author[]>("authors");
            return response.data;
        } catch (error) {
            console.error("Error fetching authors:", error);
            throw error;
        }
    }

    async create(author: any): Promise<Author> {
        const response = await api.post<Author>("authors", author);
        return response.data;
    }

    async update(author: Author): Promise<Author> {
        const response = await api.put<Author>(`authors/${author.id}`, author);
        return response.data;
    }

    async deleteById(id: number | bigint): Promise<void> {
        await api.delete(`authors/${id}`);
    }
}
