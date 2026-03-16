package ru.russify.models;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PlaylistWithTracks {

    private Long id;
    private String name;
    private Long userId;
    private Boolean isSystem;
    private String coverHash;

    private List<PlaylistTrackDto> tracks;

}
