package ru.russify.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavouriteTrackDto {

    private Long id;
    private String name;
    private Long genreId;
    private String genreName;
    private String coverHash;
    private String audioHash;
}
