package ru.russify.russifyservice.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.russify.models.response.UserProfileResponse;
import ru.russify.models.response.UserSettingsResponse;
import ru.russify.russifyservice.exception.UserNotFoundException;
import ru.russify.russifyservice.model.User;
import ru.russify.russifyservice.model.UserSettings;
import ru.russify.russifyservice.repository.UserRepository;
import ru.russify.russifyservice.repository.UserSettingsRepository;
import ru.russify.russifyservice.service.interfaces.UserService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;

    @Override
    public UserProfileResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException());

        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                null,
                user.getCreatedAt(),
                null // заглушка
        );
    }

    @Override
    public UserSettingsResponse getSettings(String email) {

        UserSettings settings = userSettingsRepository.findByUserEmail(email)
                .orElseGet(() -> {

                    User user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new UserNotFoundException());

                    UserSettings newSettings = UserSettings.builder()
                            .user(user)
                            .theme("LIGHT")
                            .language("RU")
                            .build();

                    return userSettingsRepository.save(newSettings);
                });

        return new UserSettingsResponse(
                settings.getTheme(),
                settings.getLanguage()
        );
    }
}
