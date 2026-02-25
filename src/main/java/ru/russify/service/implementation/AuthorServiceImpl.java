package ru.russify.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.russify.dto.AuthorDto;
import ru.russify.dto.request.CreateAuthorDto;
import ru.russify.dto.request.UpdateAuthorDto;
import ru.russify.exception.AuthorNotFoundException;
import ru.russify.mapper.AuthorMapper;
import ru.russify.model.Author;
import ru.russify.repository.AuthorRepository;
import ru.russify.service.interfaces.AuthorService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository repository;
    private final AuthorMapper mapper;

    public AuthorDto create(CreateAuthorDto dto) {
        Author author = mapper.toEntity(dto);
        return mapper.toDto(repository.save(author));
    }

    public AuthorDto update(Long id, UpdateAuthorDto dto) {
        Author author = repository.findById(id)
                .orElseThrow(() -> new AuthorNotFoundException(id));

        mapper.updateEntity(dto, author);

        return mapper.toDto(repository.save(author));
    }

    public List<AuthorDto> findAllDto() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public AuthorDto findByIdDto(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new AuthorNotFoundException(id));
    }

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
