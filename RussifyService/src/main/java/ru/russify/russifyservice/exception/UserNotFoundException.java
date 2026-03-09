package ru.russify.russifyservice.exception;

public class UserNotFoundException extends NotFoundException {
    public UserNotFoundException() {
        super("User not found");
    }
    public UserNotFoundException(Long id) {
        super("User with id " + id + " not found");
    }
}
