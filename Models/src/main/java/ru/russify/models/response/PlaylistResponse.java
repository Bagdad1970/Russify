package ru.russify.models.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlaylistResponse {

    private Long id;

    private Long userId;

    private String name;

    private Boolean isSystem;

    private String coverHash;

}
