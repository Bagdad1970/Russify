package ru.russify.exception;

public class PlaylistNotFoundException extends NotFoundException {
    public PlaylistNotFoundException(long id) {
        super("Playlist with id " + id + " not found");
    }
}