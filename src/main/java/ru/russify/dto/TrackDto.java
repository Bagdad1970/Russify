package ru.russify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class TrackDto {

    private Long id;

    @NotNull
    private Long albumId;

    @NotEmpty
    private Set<Long> authorIds;

    @NotBlank(message = "Track name cannot be empty")
    private String name;

    @NotNull(message = "Genre id is required")
    private Long genreId;

    @NotBlank(message = "Filepath to cover is required")
    private String coverFilepath;

    @NotBlank(message = "Filepath to audio is required")
    private String audioFilepath;

}
