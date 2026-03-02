package ru.russify.russifyservice.exception;

public class AuthorNotFoundException extends NotFoundException {
    public AuthorNotFoundException(long id) {
        super("Author with id " + id + " not found");
    }
}