package ru.russify.russifyservice.service.interfaces;

import ru.russify.russifyservice.model.Genre;

import java.util.List;
import java.util.Optional;

public interface GenreService {

    Genre save(Genre album);

    Genre update(Genre album);

    List<Genre> findAll();

    Optional<Genre> findById(Long id);

    void deleteById(Long id);
    
}
