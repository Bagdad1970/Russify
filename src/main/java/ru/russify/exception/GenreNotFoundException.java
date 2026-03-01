package ru.russify.exception;

public class GenreNotFoundException extends NotFoundException {
    public GenreNotFoundException(long id) {
        super("Genre with id " + id + " not found");
    }
}