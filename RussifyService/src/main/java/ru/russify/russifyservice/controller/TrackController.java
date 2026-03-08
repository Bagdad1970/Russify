package ru.russify.russifyservice.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
import ru.russify.models.projection.TrackFlatDto;
import ru.russify.models.request.TrackSearchRequest;
import ru.russify.russifyservice.service.implementation.TrackServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class TrackController {

    private final TrackServiceImpl service;

    @GetMapping("/{id}")
    public TrackDto findById(@PathVariable Long id) {
        return service.findById(id);
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
    public void deleteById(@PathVariable Long id) {
        service.deleteById(id);
    }

    @PostMapping("/search")
    public List<TrackFlatDto> search(@RequestBody TrackSearchRequest request) {

        return service.searchTracks(request);
    }
}