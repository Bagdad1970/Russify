package ru.russify.exception;

public class AlbumNotFoundException extends RuntimeException {

    private final String message;

    private final int statusCode;

    public AlbumNotFoundException(Long id) {
        super("Album with id " + id + " not found");
        this.message = "Album with id " + id + " not found";
        this.statusCode = 404;
    }

}