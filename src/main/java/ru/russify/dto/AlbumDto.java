package ru.russify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Set;

/**
 * КТО ПРОЧИТАЛ ТОТ молодец
 * параметры в DTO и MODEL ДОЛЖНЫ называться также, как и в таблицах!!!
 */
@Data
public class AlbumDto {

    private Long id;

    @NotBlank(message = "The album title cannot be empty")
    private String name;

    @NotNull(message = "The album type is required")
    private AlbumTypeDto type;

    @NotNull(message = "The release date is required")
    private OffsetDateTime releasedAt;

    @NotEmpty(message = "Album must contain at least one track")
    private Set<Long> trackIds;

    @NotEmpty(message = "Album must contain at least one author")
    private Set<Long> authorIds;

    public AlbumDto(
            Long id,
            String name,
            String typeName,
            OffsetDateTime releasedAt
    ) {
        this.id = id;
        this.name = name;
        this.type = new AlbumTypeDto();
        this.type.setName(typeName);
        this.releasedAt = releasedAt;
    }
}