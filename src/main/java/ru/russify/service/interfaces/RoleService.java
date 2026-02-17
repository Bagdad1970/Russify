package ru.russify.service.interfaces;

import ru.russify.model.Role;

import java.util.List;
import java.util.Optional;

public interface RoleService {

    Role save(Role album);

    Role update(Role album);

    List<Role> findAll();

    Optional<Role> findById(Long id);

    void deleteById(Long id);
    
}
