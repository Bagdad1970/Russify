package ru.russify.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity(name = "album_type")
@Table(name = "album_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlbumType {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE)
    @Column(name = "album_type_id")
    private Long id;

    private String name;

    @OneToMany(mappedBy="albumType")
    private Set<Album> albums;

}
