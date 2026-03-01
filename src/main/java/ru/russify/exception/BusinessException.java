package ru.russify.exception;

public abstract class BusinessException extends RuntimeException {
    private final int status;

    protected BusinessException(String message, int status) {
        super(message);
        this.status = status;
    }

    public int getStatus() {
        return status;
    }
}
