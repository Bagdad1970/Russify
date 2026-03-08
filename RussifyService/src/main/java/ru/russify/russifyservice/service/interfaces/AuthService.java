package ru.russify.russifyservice.service.interfaces;

import ru.russify.models.request.CreateUserDto;
import ru.russify.models.request.LoginUserDto;
import ru.russify.models.response.AuthResponse;
import ru.russify.models.response.MeResponse;

public interface AuthService {

    public AuthResponse register(CreateUserDto dto);

    AuthResponse login(LoginUserDto dto);

    void logout(String token);

    MeResponse getCurrentUser(String email);
}
