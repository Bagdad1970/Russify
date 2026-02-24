package ru.russify.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.russify.exception.AuthorNotFoundException;
import ru.russify.model.Author;
import ru.russify.repository.AuthorRepository;
import ru.russify.service.interfaces.AuthorService;

import java.util.List;
import java.util.Optional;

@Service
public class AuthorServiceImpl implements AuthorService {

    @Autowired
    private AuthorRepository repository;

    @Override
    public Author save(Author author) {
        return repository.save(author);
    }

    @Override
    public Author update(Author author) {
        Author existing = repository.findById(author.getId())
                .orElseThrow(() -> new AuthorNotFoundException(author.getId()));

        if (author.getName() != null) existing.setName(author.getName());
        if (author.getPhotoFilepath() != null) existing.setPhotoFilepath(author.getPhotoFilepath());
        if (author.getDescription() != null) existing.setDescription(author.getDescription());

        return repository.save(existing);
    }

    @Override
    public List<Author> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Author> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

}
