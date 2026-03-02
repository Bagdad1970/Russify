package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.russifyservice.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

}
