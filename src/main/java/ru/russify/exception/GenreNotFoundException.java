package ru.russify.exception;

public class GenreNotFoundException extends RuntimeException {

    private final String message;

    private final int statusCode;

    public GenreNotFoundException(long id) {
        super("Genre with id " + id + " not found");
        this.message = "Genre with id " + id + " not found";
        this.statusCode = 404;
    }

}