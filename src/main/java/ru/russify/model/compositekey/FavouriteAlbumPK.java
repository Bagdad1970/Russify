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
public class FavouriteAlbumPK implements Serializable {

    private Long userId;

    private Long albumId;

}