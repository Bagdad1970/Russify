import type { Track } from "./Track.ts";

export type Playlist = {
    id: number | bigint;
    userId?: number | bigint;
    name: string;
    isSystem: boolean;
    coverHash?: string | null;
    description?: string;
    tracks?: Track[];
}
