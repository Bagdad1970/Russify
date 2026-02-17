package ru.russify.exception;

public class PlaylistNotFoundException extends RuntimeException {

    private final String message;

    private final int statusCode;

    public PlaylistNotFoundException(long id) {
        super("Playlist with id " + id + " not found");
        this.message = "Playlist with id " + id + " not found";
        this.statusCode = 404;
    }

}