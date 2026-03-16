package ru.russify.russifyservice.exception;

import org.springframework.http.HttpStatus;

public class AlreadyInFavouritesException extends BusinessException {
    public AlreadyInFavouritesException(String message) {
        super(message, HttpStatus.BAD_REQUEST.value());
    }
}
