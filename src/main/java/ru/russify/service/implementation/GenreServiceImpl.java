package ru.russify.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.russify.exception.GenreNotFoundException;
import ru.russify.model.Genre;
import ru.russify.repository.GenreRepository;
import ru.russify.service.interfaces.GenreService;

import java.util.List;
import java.util.Optional;

@Service
public class GenreServiceImpl implements GenreService {

    @Autowired
    private GenreRepository repository;

    @Override
    public Genre save(Genre genre) {
        return repository.save(genre);
    }

    @Override
    public Genre update(Genre genre) {
        Genre existing = repository.findById(genre.getId())
                .orElseThrow(() -> new GenreNotFoundException(genre.getId()));

        if (genre.getName() != null) existing.setName(genre.getName());

        return repository.save(existing);
    }

    @Override
    public List<Genre> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Genre> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

}
