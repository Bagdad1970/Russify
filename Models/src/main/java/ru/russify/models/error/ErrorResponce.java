package ru.russify.models.error;

import java.time.Instant;

public record ErrorResponce(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path
) {}