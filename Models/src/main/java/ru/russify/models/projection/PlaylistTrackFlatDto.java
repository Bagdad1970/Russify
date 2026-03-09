package ru.russify.models.projection;

public record PlaylistTrackFlatDto(

        Long playlistId,
        String playlistName,
        Long userID,
        Boolean isSystem,

        Long trackId,
        String trackName,
        Long genreId,
        String genreName,
        String coverHash,
        String audioHash
) {}