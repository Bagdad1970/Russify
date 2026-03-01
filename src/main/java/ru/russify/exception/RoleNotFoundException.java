package ru.russify.exception;

public class RoleNotFoundException extends NotFoundException {
    public RoleNotFoundException(long id) {
        super("Role with id " + id + " not found");
    }
}