package ru.russify.models.request.track;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrackResponse {

    private Long id;

    private Set<Long> albumIds;

    private Set<Long> authorIds;

    private String name;

    private String coverHash;

    private String audioHash;

    private Long genreId;

}
