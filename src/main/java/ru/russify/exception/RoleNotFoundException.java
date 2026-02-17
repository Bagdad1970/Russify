package ru.russify.exception;

public class RoleNotFoundException extends RuntimeException {

    private final String message;

    private final int statusCode;

    public RoleNotFoundException(long id) {
        super("Role with id " + id + " not found");
        this.message = "Role with id " + id + " not found";
        this.statusCode = 404;
    }

}