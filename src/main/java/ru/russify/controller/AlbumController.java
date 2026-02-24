package ru.russify.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.russify.dto.AlbumDto;
import ru.russify.dto.request.CreateAlbumDto;
import ru.russify.dto.request.UpdateAlbumDto;
import ru.russify.mapper.AlbumMapper;
import ru.russify.model.Album;
import ru.russify.service.implementation.AlbumServiceImpl;

import java.util.List;

@RestController
@RequestMapping("api/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumServiceImpl service;
    private final AlbumMapper mapper;

    @GetMapping
    public List<AlbumDto> getAll() {
        return service.findAllWithRelations();
    }

    @PostMapping
    public AlbumDto create(@RequestBody @Valid CreateAlbumDto dto) {
        return mapper.toDto(service.create(dto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping("/{id}")
    public AlbumDto update(
            @PathVariable Long id,
            @RequestBody @Valid UpdateAlbumDto dto) {
        return mapper.toDto(service.update(id, dto));
    }
}