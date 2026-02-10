package ru.russify.model.compositekey;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@EqualsAndHashCode
public class FavouriteTrackPK {

    private Long userId;

    private Long trackId;

}
