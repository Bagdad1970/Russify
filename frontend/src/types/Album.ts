import {Track} from "./Track";

export type Album = {
    id: bigint,
    title: number,
    date: string,


    tracks: Track[]
}