package ru.russify.exception;

import org.springframework.http.HttpStatus;

public abstract class NotFoundException extends BusinessException{
    protected NotFoundException(String message){
        super(message, HttpStatus.NOT_FOUND.value());
    }
}
