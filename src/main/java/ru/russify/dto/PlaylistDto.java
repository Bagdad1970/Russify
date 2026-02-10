package ru.russify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class PlaylistDto {

    private Long id;

    @NotBlank(message = "Playlist name cannot be empty")
    private String name;

    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "System playlist flag is required")
    private Boolean isSystem;

    private Set<Long> trackIds;

}