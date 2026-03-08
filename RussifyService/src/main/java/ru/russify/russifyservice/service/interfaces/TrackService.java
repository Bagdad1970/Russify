package ru.russify.russifyservice.service.interfaces;

import ru.russify.models.TrackDto;
import ru.russify.models.projection.TrackFlatDto;
import ru.russify.models.request.TrackSearchRequest;

import java.util.List;

public interface TrackService {

    TrackDto create(TrackDto album);

    TrackDto update(Long id, TrackDto album);

    TrackDto findById(Long id);

    void deleteById(Long id);

    List<TrackFlatDto> searchTracks(TrackSearchRequest request);
}
