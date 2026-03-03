package ru.russify.models.projection;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Такой подход необходим, т.к. JPQL не умеет собирать несколько коллекций
 * в одну DTO без дубликатов строк
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TrackFlatDto {

    private Long id;

    private String name;

    private Long genreId;

    private String coverHash;

    private String audioHash;

    private Long albumId;

    private Long authorId;

}
