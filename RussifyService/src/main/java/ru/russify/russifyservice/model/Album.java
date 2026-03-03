package ru.russify.russifyservice.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.russify.models.AlbumStatus;

import java.time.OffsetDateTime;
import java.util.Set;


/**
 * КТО ПРОЧИТАЛ ТОТ молодец
 * параметры в DTO и MODEL ДОЛЖНЫ называться также, как и в таблицах!!!
 */
@Entity
@Table(name = "albums")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AlbumStatus status;

    @Column(name = "released_at", nullable = false)
    private OffsetDateTime releasedAt;

    @Column(name = "cover_hash", nullable = true, length = 64)
    private String coverHash;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TrackAlbum> trackAlbums;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AuthorAlbum> authorAlbums;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<FavouriteAlbum> favouriteAlbums;
}
