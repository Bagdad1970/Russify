package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;
import ru.russify.model.compositekey.TrackPlaylistPK;

@Entity(name = "track_playlist")
@Table(name = "track_of_playlist")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrackPlaylist {

    @EmbeddedId
    private TrackPlaylistPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("playlistId")
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("trackId")
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

}