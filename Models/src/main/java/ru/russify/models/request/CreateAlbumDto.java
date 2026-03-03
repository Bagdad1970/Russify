package ru.russify.models.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateAlbumDto {

    @NotBlank
    private String title;

    @NotNull
    private Long albumTypeId;

    @NotNull
    private OffsetDateTime releasedAt;

    private String coverHash;

    @NotEmpty
    private Set<Long> trackIds;

    @NotEmpty
    private Set<Long> authorIds;

}
