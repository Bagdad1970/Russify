package ru.russify.russifyservice.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.russify.models.response.UserProfileResponse;
import ru.russify.russifyservice.exception.UserNotFoundException;
import ru.russify.russifyservice.model.User;
import ru.russify.russifyservice.repository.UserRepository;
import ru.russify.russifyservice.service.interfaces.UserService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

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
                null
        );
    }
}
