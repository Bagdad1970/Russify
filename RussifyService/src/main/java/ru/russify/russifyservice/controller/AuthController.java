package ru.russify.russifyservice.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.russify.models.request.CreateUserDto;
import ru.russify.models.request.LoginUserDto;
import ru.russify.models.response.AuthResponse;
import ru.russify.models.response.MeResponse;
import ru.russify.russifyservice.service.implementation.AuthServiceImpl;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AuthController {

    private final AuthServiceImpl authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody CreateUserDto request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginUserDto request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.OK)
    public void logout(Authentication authentication) {

        String token = (String) authentication.getCredentials();

        authService.logout(token);
    }

    @GetMapping("/me")
    public MeResponse me(Authentication authentication) {

        String email = (String) authentication.getPrincipal();

        return authService.getCurrentUser(email);
    }
}