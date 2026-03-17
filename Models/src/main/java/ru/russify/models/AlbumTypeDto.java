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
public class AlbumTypeDto {

    private Long id;

    @NotBlank(message = "The album type name cannot be empty")
    private String name;

    public AlbumTypeDto(String name) {
        this.name = name;
    }

}
