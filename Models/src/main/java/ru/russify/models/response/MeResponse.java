package ru.russify.models.response;

public record MeResponse(
        Long id,
        String username,
        String email,
        Long roleID
) {}
