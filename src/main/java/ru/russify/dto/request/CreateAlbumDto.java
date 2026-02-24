package ru.russify.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Set;

@Data
public class CreateAlbumDto {

    @NotBlank
    private String title;

    @NotNull
    private Long albumTypeId;

    @NotNull
    private OffsetDateTime releasedAt;

    @NotEmpty
    private Set<Long> trackIds;

    @NotEmpty
    private Set<Long> authorIds;
}
