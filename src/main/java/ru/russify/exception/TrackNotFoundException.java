package ru.russify.exception;

public class TrackNotFoundException extends RuntimeException {

    private final String message;

    private final int statusCode;

    public TrackNotFoundException(long id) {
        super("Track with id " + id + " not found");
        this.message = "Track with id " + id + " not found";
        this.statusCode = 404;
    }

}