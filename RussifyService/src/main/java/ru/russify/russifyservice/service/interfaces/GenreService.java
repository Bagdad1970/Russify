package ru.russify.russifyservice.service.interfaces;

import ru.russify.models.GenreDto;

import java.util.List;

public interface GenreService {

    GenreDto create(GenreDto album);

    GenreDto update(Long id, GenreDto album);

    List<GenreDto> findAll();

    GenreDto findById(Long id);

    void deleteById(Long id);
    
}
