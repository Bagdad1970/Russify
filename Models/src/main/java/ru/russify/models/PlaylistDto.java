package ru.russify.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistDto {

    private Long id;

    @NotBlank(message = "Playlist name cannot be empty")
    private String name;

    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "System playlist flag is required")
    private Boolean isSystem;

}