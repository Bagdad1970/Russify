package ru.russify.service.interfaces;

import ru.russify.model.Album;

import java.util.List;
import java.util.Optional;

public interface AlbumService {

    Album save(Album album);

    Album update(Album album);

    List<Album> findAll();

    Optional<Album> findById(Long id);

    void deleteById(Long id);

}
