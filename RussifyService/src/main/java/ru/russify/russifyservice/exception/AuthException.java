package ru.russify.russifyservice.exception;

import org.springframework.http.HttpStatus;

public class AuthException extends BusinessException {
    public AuthException(String message) {
        super(message, HttpStatus.UNAUTHORIZED.value());
    }
}
