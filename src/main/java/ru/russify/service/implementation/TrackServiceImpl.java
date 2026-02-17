package ru.russify.service.implementation;

import org.springframework.stereotype.Service;
import ru.russify.exception.TrackNotFoundException;
import ru.russify.model.Track;
import ru.russify.repository.TrackRepository;
import ru.russify.service.interfaces.TrackService;

import java.util.List;
import java.util.Optional;

@Service
public class TrackServiceImpl implements TrackService {

    private final TrackRepository repository;

    public TrackServiceImpl(TrackRepository repository) {
        this.repository = repository;
    }

    @Override
    public Track save(Track track) {
        return repository.save(track);
    }

    @Override
    public Track update(Track track) {
        Track existing = repository.findById(track.getId())
                .orElseThrow(() -> new TrackNotFoundException(track.getId()));

        if (track.getName() != null) existing.setName(track.getName());
        if (track.getAudioFilepath() != null) existing.setAudioFilepath(track.getAudioFilepath());
        if (track.getGenre() != null) existing.setGenre(track.getGenre());
        if (track.getCoverFilepath() != null) existing.setCoverFilepath(track.getCoverFilepath());

        return repository.save(existing);
    }

    @Override
    public List<Track> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Track> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

}
