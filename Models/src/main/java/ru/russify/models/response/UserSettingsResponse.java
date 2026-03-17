package ru.russify.models.response;

public record UserSettingsResponse (
    String theme,
    String language
)
{}
