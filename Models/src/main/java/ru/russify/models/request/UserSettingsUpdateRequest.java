package ru.russify.models.request;

import lombok.Data;
import ru.russify.models.Language;
import ru.russify.models.Theme;

@Data
public class UserSettingsUpdateRequest {

    private Theme theme;
    private Language language;
}