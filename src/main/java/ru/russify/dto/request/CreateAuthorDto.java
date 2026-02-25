package ru.russify.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateAuthorDto {

    @NotBlank
    private String name;

    private String photoFilepath;

    private String description;
}