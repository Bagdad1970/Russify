package ru.russify.models.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.russify.models.AlbumStatus;

import java.time.OffsetDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAlbumDto {

    @NotBlank
    private String title;

    @NotNull
    private Long albumTypeId;

    @NotBlank
    private OffsetDateTime releasedAt;

    private String coverHash;

    private AlbumStatus status;

    @NotNull
    private Set<Long> trackIds;

    @NotNull
    private Set<Long> authorIds;
}
