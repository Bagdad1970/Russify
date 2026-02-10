package ru.russify.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TrackPlaylistDto {
    private Long id;

    @NotNull(message = "ID плейлиста обязателен")
    private Long playlistId;

    @NotNull(message = "ID трека обязателен")
    private Long trackId;
}