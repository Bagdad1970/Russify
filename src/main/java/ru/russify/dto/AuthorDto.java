package ru.russify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthorDto {
    private Long id;

    @NotBlank(message = "Имя автора не может быть пустым")
    private String name;

    private String photoFilepath;
    private String description;
}