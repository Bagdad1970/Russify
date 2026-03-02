package ru.russify.russifyservice.service.interfaces;

import ru.russify.russifyservice.model.Author;

import java.util.List;
import java.util.Optional;

public interface AuthorService {

    Author save(Author album);

    Author update(Author album);

    List<Author> findAll();

    Optional<Author> findById(Long id);

    void deleteById(Long id);

}
