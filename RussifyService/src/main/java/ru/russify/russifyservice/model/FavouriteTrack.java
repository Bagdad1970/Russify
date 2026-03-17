package ru.russify.russifyservice.model;

import jakarta.persistence.*;
import lombok.*;
import ru.russify.russifyservice.model.compositekey.FavouriteTrackPK;

@Entity
@Table(name = "favourite_tracks")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavouriteTrack {

    @EmbeddedId
    private FavouriteTrackPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("trackId")
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}