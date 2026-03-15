package ru.russify.russifyservice.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.russify.models.AlbumDto;
import ru.russify.models.request.AlbumCreateRequest;
import ru.russify.models.request.UpdateAlbumDto;
import ru.russify.russifyservice.mapper.AlbumMapper;
import ru.russify.russifyservice.service.implementation.AlbumServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AlbumController {

    private final AlbumServiceImpl service;
    private final AlbumMapper mapper;

    @GetMapping
    public List<AlbumDto> findAll() {
        return service.findAllWithRelations();
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<AlbumDto> createAlbum(
            @ModelAttribute AlbumCreateRequest request
    ) {
        return ResponseEntity.ok(service.createAlbum(request));
    }

    @GetMapping("/{albumId}")
    public AlbumDto getAlbum(@PathVariable Long albumId) {
        return service.getAlbumById(albumId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping("/{id}")
    public AlbumDto update(
            @PathVariable Long id,
            @RequestBody @Valid UpdateAlbumDto dto) {
        return mapper.toDto(service.update(id, dto));
    }
}