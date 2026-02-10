package ru.russify.model;

import jakarta.persistence.*;
import lombok.*;
import ru.russify.model.compositekey.AuthorTrackPK;

@Entity(name = "author_track")
@IdClass(AuthorTrackPK.class)
@Table(name = "author_of_track")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthorTrack {

    @Id
    private Long authorId;

    @Id
    private Long trackId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

}