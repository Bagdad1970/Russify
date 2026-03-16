package ru.russify.models.response;

import java.time.OffsetDateTime;

public record UserProfileResponse(
        Long userId,
        String username,
        String email,
        String avatarUrl,
        OffsetDateTime createdAt,
        Long monthlyAuthorPlays // пока оставляю
) {}