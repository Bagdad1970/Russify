import api from "./ApiClient.ts";
import {Role} from "../../../frontend/src/types/Role";
import {RoleCreateRequest} from "../../../frontend/src/types/request/RoleCreateRequest";

export class RoleManager {

    async create(role: RoleCreateRequest): Promise<Role> {
        try {
            const response = await api.post<Role>("roles", role);
            return response.data;
        }
        catch (error) {
            console.error("Error creating role:", error);
            throw error;
        }
    }

    async update(role: Role): Promise<Role> {
        try {
            const response = await api.put<Role>(`roles/${role.id}`, role);
            return response.data;
        }
        catch (error) {
            console.error("Error updating role:", error);
            throw error;
        }
    }

    async findAll(): Promise<Role[]> {
        try {
            const response = await api.get<Role[]>("roles");
            return response.data;
        }
        catch (error) {
            console.error("Error fetching roles:", error);
            throw error;
        }
    }

    async findById(id: bigint): Promise<Role> {
        try {
            const response = await api.get<Role>(`roles/${id}`);
            return response.data;
        }
        catch (error) {
            console.error("Error fetching Role by id:", error);
            throw error;
        }
    }

    async deleteById(id: bigint): Promise<void> {
        try {
            await api.delete(`roles/${id}`);
        }
        catch (error) {
            console.error("Error deleting role:", error);
            throw error;
        }
    }

}