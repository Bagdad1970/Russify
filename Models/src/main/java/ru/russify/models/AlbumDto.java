package ru.russify.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlbumDto {

    private Long id;

    private String title;

    private AlbumTypeDto type;

    private AlbumStatus status;

    private OffsetDateTime releasedAt;

    private String coverHash;

    private Set<TrackDto> tracks;

    private Set<AuthorDto> authors;

    public AlbumDto(
            Long id,
            String title,
            String typeName,
            AlbumStatus status,
            String coverHash,
            OffsetDateTime releasedAt
    ) {
        this.id = id;
        this.title = title;
        this.type = new AlbumTypeDto(typeName);
        this.status = status;
        this.coverHash = coverHash;
        this.releasedAt = releasedAt;
    }

}
