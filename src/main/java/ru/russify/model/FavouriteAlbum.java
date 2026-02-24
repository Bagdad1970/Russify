package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;
import ru.russify.model.compositekey.FavouriteAlbumPK;

@Entity(name = "favourite_album")
@Table(name = "favourite_albums")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavouriteAlbum {

    @EmbeddedId
    private FavouriteAlbumPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("albumId")
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}