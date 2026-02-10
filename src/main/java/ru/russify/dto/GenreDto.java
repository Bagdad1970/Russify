package ru.russify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GenreDto {

    private Long id;

    @NotBlank(message = "The genre name cannot be empty")
    private String name;

}
