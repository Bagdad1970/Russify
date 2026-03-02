package ru.russify.russifyservice.model.compositekey;

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
public class AuthorTrackPK implements Serializable {

    private Long authorId;

    private Long trackId;

}