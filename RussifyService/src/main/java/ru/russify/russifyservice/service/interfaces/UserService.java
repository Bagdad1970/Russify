package ru.russify.russifyservice.service.interfaces;

import ru.russify.models.request.UserSettingsUpdateRequest;
import ru.russify.models.response.UserProfileResponse;
import ru.russify.models.response.UserSettingsResponse;

public interface UserService {

    UserProfileResponse getProfile(String email);

    UserSettingsResponse getSettings(String email);

    void updateSettings(String email, UserSettingsUpdateRequest request);

}
