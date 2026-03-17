package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.russifyservice.model.UserSettings;

import java.util.Optional;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {

    Optional<UserSettings> findByUserEmail(String email);
}
