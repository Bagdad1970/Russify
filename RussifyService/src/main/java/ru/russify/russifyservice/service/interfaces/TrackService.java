package ru.russify.russifyservice.service.interfaces;

import ru.russify.russifyservice.model.Track;

import java.util.List;
import java.util.Optional;

public interface TrackService {

    Track save(Track album);

    Track update(Track album);

    List<Track> findAll();

    Optional<Track> findById(Long id);

    void deleteById(Long id);
    
}
