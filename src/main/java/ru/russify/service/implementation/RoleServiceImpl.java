package ru.russify.service.implementation;

import ru.russify.exception.RoleNotFoundException;
import ru.russify.model.Role;
import ru.russify.repository.RoleRepository;
import ru.russify.service.interfaces.RoleService;

import java.util.List;
import java.util.Optional;

public class RoleServiceImpl implements RoleService {

    private final RoleRepository repository;

    public RoleServiceImpl(RoleRepository repository) {
        this.repository = repository;
    }

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
