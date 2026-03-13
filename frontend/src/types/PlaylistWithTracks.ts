import {type Track} from "./Track.ts";

export type PlaylistWithTracks = {
    id: bigint,
    userId: bigint,
    name: string,
    isSystem: boolean,
    coverHash: string,
    tracks: Track[]
}