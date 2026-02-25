package ru.russify.dto.projection;

public record TrackFlatDto(
        Long id,
        String name,
        Long genreId,
        String coverFilepath,
        String audioFilepath,
        Long albumId,
        Long authorId
) {
}
