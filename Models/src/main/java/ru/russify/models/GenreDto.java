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
public class GenreDto {

    private Long id;

    @NotBlank(message = "The genre name cannot be empty")
    private String name;

}
