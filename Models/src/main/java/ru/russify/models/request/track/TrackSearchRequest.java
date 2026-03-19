package ru.russify.models.request.track;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public record TrackSearchRequest(
        String name,

        @Schema(name = "genre_ids")
        List<Long> genreIds
) {}
