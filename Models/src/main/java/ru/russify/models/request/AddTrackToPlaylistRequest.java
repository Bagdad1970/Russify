package ru.russify.models.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

public record AddTrackToPlaylistRequest(
        @NotNull
        @JsonProperty("track_id")
        Long trackId

) {}