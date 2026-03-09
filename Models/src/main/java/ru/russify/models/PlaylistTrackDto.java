package ru.russify.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlaylistTrackDto {

    private Long id;
    private String name;
    private Long genreId;
    private String genreName;
    private String coverHash;
    private String audioHash;
}
