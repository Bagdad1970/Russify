package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;
import ru.russify.model.compositekey.AuthorAlbumPK;

@Entity(name = "author_album")
@IdClass(AuthorAlbumPK.class)
@Table(name = "author_of_album")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthorAlbum {

    @Id
    private Long authorId;

    @Id
    private Long albumId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

}