package ru.russify.russifyservice.service.interfaces;

import ru.russify.models.AuthorDto;
import ru.russify.models.request.author.CreateAuthorDto;
import ru.russify.models.request.author.UpdateAuthorDto;

import java.util.List;

public interface AuthorService {

    AuthorDto create(CreateAuthorDto album);

    AuthorDto update(Long id, UpdateAuthorDto album);

    List<AuthorDto> findAll();

    AuthorDto findById(Long id);

    void deleteById(Long id);

}
