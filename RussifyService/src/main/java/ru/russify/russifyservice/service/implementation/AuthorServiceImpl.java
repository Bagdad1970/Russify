package ru.russify.russifyservice.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.russify.models.AuthorDto;
import ru.russify.models.request.CreateAuthorDto;
import ru.russify.models.request.UpdateAuthorDto;
import ru.russify.russifyservice.exception.AuthorNotFoundException;
import ru.russify.russifyservice.mapper.AuthorMapper;
import ru.russify.russifyservice.model.Author;
import ru.russify.russifyservice.repository.AuthorRepository;
import ru.russify.russifyservice.service.interfaces.AuthorService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository repository;
    private final AuthorMapper mapper;

    @Override
    public AuthorDto create(CreateAuthorDto dto) {
        Author author = mapper.toEntity(dto);
        return mapper.toDto(repository.save(author));
    }

    @Override
    public AuthorDto update(Long id, UpdateAuthorDto dto) {
        Author author = repository.findById(id)
                .orElseThrow(() -> new AuthorNotFoundException(id));

        mapper.updateEntity(dto, author);

        return mapper.toDto(repository.save(author));
    }

    @Override
    public List<AuthorDto> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public AuthorDto findById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new AuthorNotFoundException(id));
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

}
