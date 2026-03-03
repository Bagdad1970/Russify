package ru.russify.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class TrackDto {

    private Long id;

    @NotNull
    private Set<Long> albumIds;

    @NotEmpty
    private Set<Long> authorIds;

    private String coverHash;

    @NotNull
    private String audioHash;

    @NotBlank(message = "Track name cannot be empty")
    private String name;

    @NotNull(message = "Genre id is required")
    private Long genreId;

}
