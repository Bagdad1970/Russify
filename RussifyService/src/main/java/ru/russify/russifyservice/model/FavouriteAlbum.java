package ru.russify.russifyservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "favourite_album")
@Table(name = "favourite_albums")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavouriteAlbum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}