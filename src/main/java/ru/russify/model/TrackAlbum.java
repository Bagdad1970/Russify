package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "track_album")
@Table(name = "track_of_album")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrackAlbum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

}