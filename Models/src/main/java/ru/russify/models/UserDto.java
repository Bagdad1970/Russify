package ru.russify.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private Long id;

    @NotNull(message = "Role is required")
    private Long roleId;

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 50, message = "Имя пользователя должно быть от 3 до 50 символов")
    private String username;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Incorrect email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, max = 255, message = "Password must contain from 6 to 255 characters")
    private String password;

    private OffsetDateTime createdAt;

}