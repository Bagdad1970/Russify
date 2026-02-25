package ru.russify.dto.projection;

/**
 * Такой подход необходим, т.к. JPQL не умеет собирать несколько коллекций
 * в одну DTO без дубликатов строк
 *
 * @param id
 * @param name
 * @param genreId
 * @param coverFilepath
 * @param audioFilepath
 * @param albumId
 * @param authorId
 */
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
