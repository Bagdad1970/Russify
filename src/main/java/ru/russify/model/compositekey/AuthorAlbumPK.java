package ru.russify.model.compositekey;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Embeddable
@Data
@EqualsAndHashCode
public class AuthorAlbumPK implements Serializable {

    private Long authorId;

    private Long albumId;

}