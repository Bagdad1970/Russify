package ru.russify.dto.projection;

import java.time.OffsetDateTime;

/**
 * Такой подход необходим, т.к. JPQL не умеет собирать несколько коллекций
 * в одну DTO без дубликатов строк
 *
 * @param id
 * @param title
 * @param typeName
 * @param releasedAt
 * @param trackId
 * @param authorId
 *
 */
public record AlbumFlatDto(
        Long id,
        String title,
        String typeName,
        OffsetDateTime releasedAt,
        Long trackId,
        Long authorId
) {
}
