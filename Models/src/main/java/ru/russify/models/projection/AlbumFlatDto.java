package ru.russify.models.projection;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.russify.models.AlbumStatus;

import java.time.OffsetDateTime;

/**
 * Такой подход необходим, т.к. JPQL не умеет собирать несколько коллекций
 * в одну DTO без дубликатов строк
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlbumFlatDto {
    
    private Long id;

    private Long trackId;

    private Long authorId;

    private String title;

    private String typeName;

    private OffsetDateTime releasedAt;

    private String coverHash;

    private AlbumStatus status;

}
