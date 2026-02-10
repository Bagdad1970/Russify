package ru.russify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AlbumTypeDto {

    private Long id;

    @NotBlank(message = "The album type name cannot be empty")
    private String name;

}
