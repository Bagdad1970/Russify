package ru.russify.russifyservice.service.interfaces;

import ru.russify.models.TrackDto;
import ru.russify.models.projection.TrackFlatDto;
import ru.russify.models.request.track.TrackCreateRequest;
import ru.russify.models.request.track.TrackResponse;
import ru.russify.models.request.track.TrackSearchRequest;

import java.util.List;

public interface TrackService {

    TrackResponse create(String email, TrackCreateRequest request);

    TrackDto update(String email, Long id, TrackDto album);

    TrackDto findById(Long id);

    void deleteById(String email, Long id);

    List<TrackFlatDto> searchTracks(TrackSearchRequest request);
}
