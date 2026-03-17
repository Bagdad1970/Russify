package ru.russify.models.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PlaylistCreateRequest {

    private Long userId;

    private String name;

    private Boolean isSystem;

    private MultipartFile coverFile;

}
