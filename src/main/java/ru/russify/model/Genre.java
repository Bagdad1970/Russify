package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity(name = "genre")
@Table(name = "genres")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Genre {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE)
    private Long id;

    @OneToMany(mappedBy="genre")
    private Set<Track> tracks;

    private String name;

}
