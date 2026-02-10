package ru.russify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Set;

@Data
public class AlbumDto {
    private Long id;

    @NotBlank(message = "Название альбома не может быть пустым")
    private String name;

    @NotNull(message = "Тип альбома обязателен")
    private AuthorDto type;

    @NotNull(message = "Дата выпуска обязательна")
    private OffsetDateTime releasedAt;

    private Set<Long> trackIds;
    private Set<Long> authorIds;
}
