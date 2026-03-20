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

    // TRACK
    private Long trackId;
    private String trackName;
    private Long genreId;
    private String genreName;
    private String trackCoverHash;
    private String audioHash;
    private Integer duration;

    // AUTHOR
    private Long authorId;
    private String authorName;
    private String authorPhotoHash;
    private String authorDescription;

    // ALBUM
    private String title;
    private String typeName;
    private OffsetDateTime releasedAt;
    private String coverHash;
    private AlbumStatus status;

}
