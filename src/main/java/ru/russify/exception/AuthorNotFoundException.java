package ru.russify.exception;

public class AuthorNotFoundException extends RuntimeException {

    private final String message;

    private final int statusCode;

    public AuthorNotFoundException(long id) {
        super("Author with id " + id + " not found");
        this.message = "Author with id " + id + " not found";
        this.statusCode = 404;
    }

}