package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.Set;

@Entity(name = "album")
@Table(name = "albums")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "album_id")
    private Long id;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_type_id", nullable = false)
    private AlbumType albumType;

    @Column(name = "released_at", nullable = false)
    private OffsetDateTime releasedAt;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TrackAlbum> trackAlbums;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AuthorAlbum> authorAlbums;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<FavouriteAlbum> favouriteAlbums;

}
