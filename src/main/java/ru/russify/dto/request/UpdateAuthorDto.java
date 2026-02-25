package ru.russify.dto.request;

import lombok.Data;

@Data
public class UpdateAuthorDto {

    private String name;
    private String photoFilepath;
    private String description;
}