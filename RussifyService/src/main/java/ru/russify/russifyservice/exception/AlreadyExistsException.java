package ru.russify.russifyservice.exception;

import org.springframework.http.HttpStatus;

public class AlreadyExistsException extends BusinessException {

    public AlreadyExistsException(String message){
        super(message, HttpStatus.BAD_REQUEST.value());
    }
}
