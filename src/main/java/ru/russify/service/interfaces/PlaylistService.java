package ru.russify.service.interfaces;

import ru.russify.model.Playlist;

import java.util.List;
import java.util.Optional;

public interface PlaylistService {

    Playlist save(Playlist album);

    Playlist update(Playlist album);

    List<Playlist> findAll();

    Optional<Playlist> findById(Long id);

    void deleteById(Long id);
    
}
