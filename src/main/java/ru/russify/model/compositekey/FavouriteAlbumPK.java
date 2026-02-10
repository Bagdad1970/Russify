package ru.russify.model.compositekey;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@Getter
@EqualsAndHashCode
public class FavouriteAlbumPK implements Serializable {

    private Long userId;

    private Long albumId;

}