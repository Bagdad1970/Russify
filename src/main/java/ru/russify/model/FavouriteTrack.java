package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "favourite_track")
@Table(name = "favourite_tracks")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavouriteTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}