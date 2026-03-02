package ru.russify.russifyservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RoleDto {

    private Long id;

    @NotBlank(message = "Role name cannot be empty")
    private String name;

}