package ru.russify.russifyservice.model;

import jakarta.persistence.*;
import lombok.*;
import ru.russify.russifyservice.model.compositekey.AuthorTrackPK;

@Entity(name = "author_track")
@Table(name = "author_of_track")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthorTrack {

    @EmbeddedId
    private AuthorTrackPK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("authorId")
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("trackId")
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

}