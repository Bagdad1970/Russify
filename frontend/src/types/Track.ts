export type TrackId = number | bigint;

export type Track = {
    id: TrackId;
    name: string;
    title?: string;
    genreId?: TrackId | null;
    authorIds?: Set<TrackId>;
    albumIds?: Set<TrackId>;
    coverHash?: string | null;
    audioHash?: string | null;
    duration?: number;
    artist?: string;
    album?: string;
}
