package ru.russify.russifyservice.exception;

public class AlbumAlreadyInFavouritesException extends AlreadyInFavouritesException{
    public AlbumAlreadyInFavouritesException(Long id) {
        super("Album with id " + id + " is already in Favourites");
    }
}
