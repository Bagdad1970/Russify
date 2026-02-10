package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "track_playlist")
@Table(name = "track_of_playlist")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrackPlaylist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

}