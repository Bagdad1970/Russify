package ru.russify.russifyservice.model.compositekey;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Embeddable
@AllArgsConstructor
@EqualsAndHashCode
public class FavouriteTrackPK {

    private Long userId;

    private Long trackId;

}
