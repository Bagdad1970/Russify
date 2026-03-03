package ru.russify.russifyservice.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.russify.models.GenreDto;
import ru.russify.russifyservice.exception.GenreNotFoundException;
import ru.russify.russifyservice.mapper.GenreMapper;
import ru.russify.russifyservice.model.Genre;
import ru.russify.russifyservice.repository.GenreRepository;
import ru.russify.russifyservice.service.interfaces.GenreService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepository repository;
    private final GenreMapper mapper;

    public GenreDto create(GenreDto dto) {
        Genre genre = mapper.toEntity(dto);
        return mapper.toDto(repository.save(genre));
    }

    public GenreDto update(Long id, GenreDto dto) {
        Genre genre = repository.findById(id)
                .orElseThrow(() -> new GenreNotFoundException(id));

        mapper.updateEntity(dto, genre);

        return mapper.toDto(repository.save(genre));
    }

    public List<GenreDto> findAllDto() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public GenreDto findByIdDto(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new GenreNotFoundException(id));
    }

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
