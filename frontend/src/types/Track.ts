export type Track = {
    id: bigint,
    name: string,
    genreId: bigint,
    authorIds: Set<bigint>,
    albumIds: Set<bigint>,
    coverHash: string,
    audioHash: string
}