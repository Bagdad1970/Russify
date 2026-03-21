import type { Track } from "./Track.ts";
import type { Playlist } from "./Playlist.ts";

export type PlaylistWithTracks = Playlist & {
    tracks: Track[];
}
