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

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepository repository;
    private final GenreMapper mapper;

    @Override
    public GenreDto create(GenreDto dto) {
        Genre genre = mapper.toEntity(dto);
        return mapper.toDto(repository.save(genre));
    }

    @Override
    public GenreDto update(Long id, GenreDto dto) {
        Genre genre = repository.findById(id)
                .orElseThrow(() -> new GenreNotFoundException(id));

        mapper.updateEntity(dto, genre);

        return mapper.toDto(repository.save(genre));
    }

    @Override
    public List<GenreDto> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public GenreDto findById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new GenreNotFoundException(id));
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
