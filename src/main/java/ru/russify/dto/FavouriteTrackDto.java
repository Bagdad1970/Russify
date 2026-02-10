package ru.russify.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FavouriteTrackDto {
    private Long id;

    @NotNull(message = "ID трека обязателен")
    private Long trackId;

    @NotNull(message = "ID пользователя обязателен")
    private Long userId;
}