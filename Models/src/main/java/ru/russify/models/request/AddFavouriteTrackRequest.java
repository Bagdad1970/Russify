package ru.russify.models.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AddFavouriteTrackRequest {

    @JsonProperty("track_id")
    private Long trackId;
}
