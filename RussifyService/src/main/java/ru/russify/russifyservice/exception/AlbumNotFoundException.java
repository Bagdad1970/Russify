package ru.russify.russifyservice.exception;

public class AlbumNotFoundException extends NotFoundException {
    public AlbumNotFoundException(Long id) {
        super("Album with id " + id + " not found");
    }
}