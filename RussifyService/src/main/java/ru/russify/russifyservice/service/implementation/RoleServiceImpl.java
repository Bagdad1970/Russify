package ru.russify.russifyservice.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.russify.russifyservice.exception.RoleNotFoundException;
import ru.russify.russifyservice.model.Role;
import ru.russify.russifyservice.repository.RoleRepository;
import ru.russify.russifyservice.service.interfaces.RoleService;

import java.util.List;
import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    private RoleRepository repository;

    @Override
    public Role save(Role role) {
        return repository.save(role);
    }

    @Override
    public Role update(Role role) {
        Role existing = repository.findById(role.getId())
                .orElseThrow(() -> new RoleNotFoundException(role.getId()));

        if (role.getName() != null) existing.setName(role.getName());

        return repository.save(existing);
    }

    @Override
    public List<Role> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Role> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

}
