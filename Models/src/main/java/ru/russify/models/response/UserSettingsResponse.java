package ru.russify.models.response;

import ru.russify.models.Language;
import ru.russify.models.Theme;

public record UserSettingsResponse (
    Theme theme,
    Language language
)
{}
