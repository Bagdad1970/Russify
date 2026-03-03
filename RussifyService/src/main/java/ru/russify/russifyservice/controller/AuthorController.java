package ru.russify.russifyservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.russify.models.AuthorDto;
import ru.russify.models.request.CreateAuthorDto;
import ru.russify.models.request.UpdateAuthorDto;
import ru.russify.russifyservice.service.implementation.AuthorServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorServiceImpl service;

    @GetMapping
    public List<AuthorDto> getAll() {
        return service.findAllDto();
    }

    @GetMapping("/{id}")
    public AuthorDto getById(@PathVariable Long id) {
        return service.findByIdDto(id);
    }

    @PostMapping
    public AuthorDto create(@RequestBody @Valid CreateAuthorDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public AuthorDto update(
            @PathVariable Long id,
            @RequestBody @Valid UpdateAuthorDto dto
    ) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}