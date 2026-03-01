package ru.russify.dto.error;

import java.time.Instant;

public record ErrorResponce(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path
) {}