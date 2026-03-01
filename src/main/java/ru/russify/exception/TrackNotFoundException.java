package ru.russify.exception;

public class TrackNotFoundException extends NotFoundException {
    public TrackNotFoundException(long id) {
        super("Track with id " + id + " not found");
    }
}