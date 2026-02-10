package ru.russify.model.compositekey;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@Data
@Embeddable
@AllArgsConstructor
@EqualsAndHashCode
public class TrackPlaylistPK implements Serializable {

    private Long trackId;

    private Long playlistId;

}
