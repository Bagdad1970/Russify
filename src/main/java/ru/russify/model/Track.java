package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity(name = "track")
@Table(name = "tracks")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "track_id")
    private Long id;

    @Column(name = "track_name", nullable = false, length = 255)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id", nullable = false)
    private Genre genre;

    @Column(name = "cover_filepath", nullable = false)
    private String coverFilepath;

    @Column(name = "audio_filepath", nullable = false)
    private String audioFilepath;

    @OneToMany(mappedBy = "track", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TrackPlaylist> trackPlaylists;

    @OneToMany(mappedBy = "track", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TrackAlbum> trackAlbums;

    @OneToMany(mappedBy = "track", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AuthorTrack> authorTracks;

    @OneToMany(mappedBy = "track", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<FavouriteTrack> favoriteTracks;

}
