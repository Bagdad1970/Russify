export interface User {
    id: bigint;
    email: string;
    username: string;
    avatarHash?: string;
    role?: {
        id: number;
        name: string;
    };
}