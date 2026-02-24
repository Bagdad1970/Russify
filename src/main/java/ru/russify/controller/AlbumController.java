package ru.russify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.russify.dto.AlbumDto;
import ru.russify.mapper.AlbumMapper;
import ru.russify.model.Album;
import ru.russify.service.implementation.AlbumServiceImpl;

import java.util.List;

@RestController
@RequestMapping("api/albums")
public class AlbumController {
    @Autowired
    private AlbumServiceImpl service;

    @GetMapping
    public List<AlbumDto> getAll() {
        return service.findAllWithRelations();
    }
}
