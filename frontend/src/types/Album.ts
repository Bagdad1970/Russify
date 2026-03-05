import {Track} from "./Track.ts";

export type Album = {
    id: bigint,
    albumTypeId: bigint,
    title: number,
    releasedAt: Date,
    tracks: Track[]
}