package ru.russify.russifyservice.service.implementation;

import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.patterns.IToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.russify.models.request.CreateUserDto;
import ru.russify.models.request.LoginUserDto;
import ru.russify.models.response.AuthResponse;
import ru.russify.models.response.MeResponse;
import ru.russify.russifyservice.exception.AlreadyExistsException;
import ru.russify.russifyservice.exception.AuthException;
import ru.russify.russifyservice.exception.NotFoundException;
import ru.russify.russifyservice.exception.UserNotFoundException;
import ru.russify.russifyservice.model.Role;
import ru.russify.russifyservice.model.User;
import ru.russify.russifyservice.repository.RoleRepository;
import ru.russify.russifyservice.repository.UserRepository;
import ru.russify.russifyservice.security.JwtBlacklistService;
import ru.russify.russifyservice.security.JwtService;
import ru.russify.russifyservice.service.interfaces.AuthService;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtBlacklistService jwtBlacklistService;

    public AuthResponse register(CreateUserDto dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new AlreadyExistsException("User with email " + dto.getEmail() + " already exists");
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new AlreadyExistsException("User with username " + dto.getUsername() + " already exists");
        }

        Role role = roleRepository.findByName("USER")
                .orElseThrow();

        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail());

        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .token(token)
                .build();
    }

    @Override
    public AuthResponse login(LoginUserDto dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() ->
                        new AuthException("Invalid email or password")
                );

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new AuthException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());

        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .token(token)
                .build();
    }

    @Override
    public void logout(String token){

        if (jwtBlacklistService.isBlacklisted(token)){
            throw new AuthException("Token already invalidated");
        }

        jwtBlacklistService.blacklistToken(token);
    }

    @Override
    public MeResponse getCurrentUser(String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException());

        return new MeResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getId()
        );
    }
}