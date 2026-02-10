package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;
import ru.russify.model.compositekey.TrackPlaylistPK;

@Entity(name = "track_playlist")
@IdClass(TrackPlaylistPK.class)
@Table(name = "track_of_playlist")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrackPlaylist {

    @Id
    private Long trackId;

    @Id
    private Long playlistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

}