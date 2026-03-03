package ru.russify.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Set;

/**
 * КТО ПРОЧИТАЛ ТОТ молодец
 * параметры в DTO и MODEL ДОЛЖНЫ называться также, как и в таблицах!!!
 */
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class AlbumDto {

    private Long id;

    @NotBlank(message = "The album title cannot be empty")
    private String title;

    @NotNull(message = "The album type is required")
    private AlbumTypeDto type;

    @NotNull(message = "The album status is required")
    private AlbumStatus status;

    @NotNull(message = "The release date is required")
    private OffsetDateTime releasedAt;

    private String coverHash;

    @NotEmpty(message = "Album must contain at least one track")
    private Set<Long> trackIds;

    @NotEmpty(message = "Album must contain at least one author")
    private Set<Long> authorIds;

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
        this.type = new AlbumTypeDto();
        this.type.setName(typeName);
        this.status = status;
        this.coverHash = coverHash;
        this.releasedAt = releasedAt;
    }

}