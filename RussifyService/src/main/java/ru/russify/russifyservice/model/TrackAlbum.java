package ru.russify.russifyservice.model;

import jakarta.persistence.*;
import lombok.*;
import ru.russify.russifyservice.model.compositekey.TrackAlbumPK;

@Entity(name = "track_album")
@Table(name = "track_of_album")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrackAlbum {

    @EmbeddedId
    private TrackAlbumPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("trackId")
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("albumId")
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

}