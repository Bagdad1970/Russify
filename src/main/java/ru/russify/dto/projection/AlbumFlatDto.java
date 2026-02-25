package ru.russify.dto.projection;

import java.time.OffsetDateTime;

public record AlbumFlatDto(
        Long id,
        String title,
        String typeName,
        OffsetDateTime releasedAt,
        Long trackId,
        Long authorId
) {
}
