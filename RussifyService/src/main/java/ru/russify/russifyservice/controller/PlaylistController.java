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
import ru.russify.models.PlaylistDto;
import ru.russify.russifyservice.service.implementation.PlaylistServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistServiceImpl service;

    @GetMapping
    public List<PlaylistDto> getAll() {
        return service.findAllDto();
    }

    @GetMapping("/{id}")
    public PlaylistDto getById(@PathVariable Long id) {
        return service.findByIdDto(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlaylistDto create(@RequestBody @Valid PlaylistDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public PlaylistDto update(
            @PathVariable Long id,
            @RequestBody @Valid PlaylistDto dto
    ) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}