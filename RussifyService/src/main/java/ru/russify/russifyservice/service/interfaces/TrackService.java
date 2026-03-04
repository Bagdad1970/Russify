package ru.russify.russifyservice.service.interfaces;

import ru.russify.models.TrackDto;

import java.util.List;

public interface TrackService {

    TrackDto create(TrackDto album);

    TrackDto update(Long id, TrackDto album);

    List<TrackDto> findAll();

    TrackDto findById(Long id);

    void deleteById(Long id);
    
}
