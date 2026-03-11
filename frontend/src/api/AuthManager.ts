import api from "./ApiClient";
import type { AuthResponse } from "../types/request/auth/AuthResponse";
import type { LoginUserDto } from "../types/request/auth/LoginUserDto";
import type { CreateUserDto } from "../types/request/auth/CreateUserDto";
import type { MeResponse } from "../types/request/auth/MeResponse";

export class AuthManager {

    async register(userData: CreateUserDto): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>("auth/register", userData);
            return response.data;
        }
        catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    }

    async login(credentials: LoginUserDto): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>("auth/login", credentials);

            if (response.data.token) {
                localStorage.setItem("auth_token", response.data.token);
            }

            return response.data;
        }
        catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            const token = localStorage.getItem("auth_token");

            if (token) {
                await api.post("auth/logout", null, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        }
        catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
        finally {
            localStorage.removeItem("auth_token");
        }
    }

    async getCurrentUser(): Promise<MeResponse> {
        try {
            const response = await api.get<MeResponse>("auth/me");
            return response.data;
        }
        catch (error) {
            console.error("Error fetching current user:", error);
            throw error;
        }
    }

}

export const authManager = new AuthManager();