package ru.russify.models;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthorDto {

    private Long id;

    @NotBlank(message = "Author name cannot be empty")
    private String name;

    private String photoHash;

    private String description;

}