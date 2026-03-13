package ru.russify.models.response;

import lombok.Builder;
import lombok.Data;

import java.io.InputStream;

@Data
@Builder
public class PlaylistResponse {

    private Long id;

    private Long userId;

    private String name;

    private Boolean isSystem;

    private InputStream coverHash;

}
