package ru.russify.models.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class FileResponseDto {

    private String filename;
    private String fileUrl;

}
