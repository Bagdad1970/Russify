package ru.russify.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity(name = "album_type")
@Table(name = "album_types")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlbumType {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE)
    private Long id;

    private String name;

    @OneToMany(mappedBy="album_type")
    private Set<Album> albums;

}
