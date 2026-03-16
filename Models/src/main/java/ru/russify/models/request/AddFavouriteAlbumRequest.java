package ru.russify.models.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AddFavouriteAlbumRequest {

    @JsonProperty("album_id")
    private Long albumId;

}