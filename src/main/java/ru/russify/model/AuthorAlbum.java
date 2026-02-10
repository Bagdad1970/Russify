package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;
import ru.russify.model.compositekey.AuthorAlbumPK;

@Entity(name = "author_album")
@Table(name = "author_of_album")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthorAlbum {

    @EmbeddedId
    private AuthorAlbumPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("authorId")
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("albumId")
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

}