package ru.russify.russifyservice.exception;

import org.springframework.http.HttpStatus;

public class TrackAlreadyInPlaylistException extends BusinessException {
    public TrackAlreadyInPlaylistException(Long trackId, Long playlistId) {
        super("Track " + trackId + " already exists in playlist " + playlistId, HttpStatus.BAD_REQUEST.value());
    }
}
