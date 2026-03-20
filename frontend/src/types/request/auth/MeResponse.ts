export interface MeResponse {
    id: number;
    username: string;
    email: string;
    avatarHash?: string;
    createdAt?: string;
    role?: {
        id: number;
        name: string;
    };
}