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
import ru.russify.models.TrackDto;
import ru.russify.russifyservice.service.implementation.TrackServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackServiceImpl service;

    @GetMapping
    public List<TrackDto> getAll() {
        return service.findAllDto();
    }

    @GetMapping("/{id}")
    public TrackDto getById(@PathVariable Long id) {
        return service.findByIdDto(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrackDto create(@RequestBody @Valid TrackDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public TrackDto update(
            @PathVariable Long id,
            @RequestBody @Valid TrackDto dto
    ) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}