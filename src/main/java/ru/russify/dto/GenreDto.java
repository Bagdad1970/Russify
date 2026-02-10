package ru.russify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GenreDto {
    private Long id;

    @NotBlank(message = "Название жанра не может быть пустым")
    private String name;
}
