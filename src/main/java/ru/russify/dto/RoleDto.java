package ru.russify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RoleDto {
    private Long id;

    @NotBlank(message = "Название роли не может быть пустым")
    private String name;
}