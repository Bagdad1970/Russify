import type {Track} from "./Track.ts";

export type Album = {
    id: bigint,
    albumTypeId: bigint,
    title: string,
    releasedAt: Date,
    tracks: Track[]
}