package ru.russify.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthorAlbumDto {
    private Long id;

    @NotNull(message = "ID автора обязателен")
    private Long authorId;

    @NotNull(message = "ID альбома обязателен")
    private Long albumId;
}