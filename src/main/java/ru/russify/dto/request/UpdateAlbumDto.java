package ru.russify.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Set;

@Data
public class UpdateAlbumDto {

    @NotBlank
    private String title;

    @NotNull
    private Long albumTypeId;

    @NotBlank
    private OffsetDateTime releasedAt;

    @NotNull
    private Set<Long> trackIds;

    @NotNull
    private Set<Long> authorIds;
}
