package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;
import ru.russify.model.compositekey.FavouriteTrackPK;

@Entity(name = "favourite_track")
@IdClass(FavouriteTrackPK.class)
@Table(name = "favourite_tracks")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavouriteTrack {

    @Id
    private Long userId;

    @Id
    private Long trackId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}