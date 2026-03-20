export const AlbumStatus = {
    IN_PROGRESS: "IN_PROGRESS",
    APPROVED: "APPROVED",
    DENIED: "DENIED"
} as const;

export type AlbumStatus = typeof AlbumStatus[keyof typeof AlbumStatus];
