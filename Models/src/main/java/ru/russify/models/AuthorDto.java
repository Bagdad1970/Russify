package ru.russify.models;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthorDto {

    private Long id;

    @NotBlank(message = "Author name cannot be empty")
    private String name;

    private String photoHash;

    private String description;

}