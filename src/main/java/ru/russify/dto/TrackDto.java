package ru.russify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class TrackDto {
    private Long id;

    @NotBlank(message = "Название трека не может быть пустым")
    private String name;

    @NotNull(message = "ID жанра обязателен")
    private Long genreId;

    @NotBlank(message = "Путь к обложке обязателен")
    private String coverFilepath;

    @NotBlank(message = "Путь к аудиофайлу обязателен")
    private String audioFilepath;

    private Set<Long> authorIds;
    private Set<Long> albumIds;
}
