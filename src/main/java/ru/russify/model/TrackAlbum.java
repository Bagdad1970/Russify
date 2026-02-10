package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;
import ru.russify.model.compositekey.TrackAlbumPK;

@Entity(name = "track_album")
@IdClass(TrackAlbumPK.class)
@Table(name = "track_of_album")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrackAlbum {

    @Id
    private Long trackId;

    @Id
    private Long albumId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

}