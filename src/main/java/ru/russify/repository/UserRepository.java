package ru.russify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
