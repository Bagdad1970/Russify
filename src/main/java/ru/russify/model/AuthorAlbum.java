package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "author_album")
@Table(name = "author_of_album")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthorAlbum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

}