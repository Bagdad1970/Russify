package ru.russify.model.compositekey;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@NoArgsConstructor
@Getter
@EqualsAndHashCode
public class AuthorAlbumPK implements Serializable {

    private Long authorId;

    private Long albumId;

}