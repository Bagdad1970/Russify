package ru.russify.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FavouriteAlbumDto {
    private Long id;

    @NotNull(message = "ID альбома обязателен")
    private Long albumId;

    @NotNull(message = "ID пользователя обязателен")
    private Long userId;
}
