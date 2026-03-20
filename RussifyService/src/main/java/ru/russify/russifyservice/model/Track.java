package ru.russify.russifyservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
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

    @Column(name = "cover_hash", nullable = true, length = 255)
    private String coverHash;

    @Column(name = "audio_hash", nullable = false, length = 255)
    private String audioHash;

    @Column(name = "duration", nullable = false)
    private Integer duration;

    @OneToMany(mappedBy = "track", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<TrackPlaylist> trackPlaylists = new HashSet<>();

    @OneToMany(mappedBy = "track", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<TrackAlbum> trackAlbums = new HashSet<>();

    @OneToMany(mappedBy = "track", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<AuthorTrack> authorTracks = new HashSet<>();

    @OneToMany(mappedBy = "track", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<FavouriteTrack> favoriteTracks = new HashSet<>();
}
