import type {Track} from "./Track.ts";

export type Album = {
    id: number | bigint;
    albumTypeId?: number | bigint;
    typeId?: number | bigint;
    authorId?: number | bigint;
    title: string;
    releasedAt?: Date | string | null;
    status?: string;
    coverHash?: string | null;
    coverUrl?: string | null;
    authors?: Array<{ id: number | bigint; name: string }>;
    tracks: Track[];
    trackIds?: Array<number>;
    artist?: string;
}
