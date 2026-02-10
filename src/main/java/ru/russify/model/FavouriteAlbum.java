package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;
import ru.russify.model.compositekey.FavouriteAlbumPK;

@Entity(name = "favourite_album")
@IdClass(FavouriteAlbumPK.class)
@Table(name = "favourite_albums")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavouriteAlbum {

    @Id
    private Long userId;

    @Id
    private Long albumId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}