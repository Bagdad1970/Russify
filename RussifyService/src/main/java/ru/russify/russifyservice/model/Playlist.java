package ru.russify.russifyservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity(name = "playlist")
@Table(name = "playlists")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playlist_id")
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "is_system", nullable = false)
    private Boolean isSystem;

    @Column(name = "cover_hash", length = 255)
    private String coverHash;

    @OneToMany(mappedBy = "playlist", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TrackPlaylist> trackPlaylists;

}