package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.russifyservice.model.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);
}
