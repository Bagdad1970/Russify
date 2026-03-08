package ru.russify.models.projection;

/**
 * Такой подход необходим, т.к. JPQL не умеет собирать несколько коллекций
 * в одну DTO без дубликатов строк
 */
public record TrackFlatDto (
        Long id,
        String name,
        Long genreId,
        String genreName,
        String coverHash,
        String audioHash
        )
{}
