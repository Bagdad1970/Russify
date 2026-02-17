package ru.russify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

}
