package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.russifyservice.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
