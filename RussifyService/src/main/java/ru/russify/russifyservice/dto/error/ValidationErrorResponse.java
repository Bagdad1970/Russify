package ru.russify.russifyservice.dto.error;

import java.time.Instant;
import java.util.Map;

public record ValidationErrorResponse(
        Instant timestamp,
        int status,
        String error,
        Map<String, String> errors,
        String path
) {}