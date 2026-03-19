package ru.russify.models.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlaylistResponse {

    private Long id;

    private Long userId;

    private String name;

    private Boolean isSystem;

    private String coverHash;

}
