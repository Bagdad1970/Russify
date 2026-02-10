package ru.russify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class PlaylistDto {
    private Long id;

    @NotBlank(message = "Название плейлиста не может быть пустым")
    private String name;

    @NotNull(message = "ID пользователя обязателен")
    private Long userId;

    @NotNull(message = "Флаг системного плейлиста обязателен")
    private Boolean isSystem;

    private Set<Long> trackIds;
}