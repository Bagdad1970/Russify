package ru.russify.russifyservice.exception;

public class PlaylistAlreadyInFavouritesException extends AlreadyInFavouritesException {
    public PlaylistAlreadyInFavouritesException(Long id) {
        super("Album with id " + id + " is already in Favourites");
    }
}
