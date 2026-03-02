import {Track} from "./Track";

export type Playlist = {
    id: bigint,
    title: string,
    createdAt: string,
    tracks: Track[]
}