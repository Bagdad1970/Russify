package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "author_track")
@Table(name = "author_of_track")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthorTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

}