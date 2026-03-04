package ru.russify.russifyservice.service.interfaces;

import ru.russify.models.PlaylistDto;

import java.util.List;

public interface PlaylistService {

    PlaylistDto create(PlaylistDto playlist);

    PlaylistDto update(Long id, PlaylistDto playlist);

    List<PlaylistDto> findAll();

    PlaylistDto findById(Long id);

    void deleteById(Long id);

}
