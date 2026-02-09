package ru.russify.russifyservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity(name = "author")
@Table(name = "author")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Author {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "author_id")
    private Long id;

    @Column(name = "author_name", nullable = false, length = 255)
    private String name;

    @Column(name = "photo_filepath", nullable = true, length = 255)
    private String photoFilepath;

    @Column(name = "description", nullable = true, length = 500)
    private String description;

    @OneToMany(mappedBy = "author_album", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AuthorAlbum> authorAlbums;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AuthorTrack> authorTracks;

}