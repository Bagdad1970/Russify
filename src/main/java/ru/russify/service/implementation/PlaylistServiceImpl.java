package ru.russify.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.russify.exception.PlaylistNotFoundException;
import ru.russify.model.Playlist;
import ru.russify.repository.PlaylistRepository;
import ru.russify.service.interfaces.PlaylistService;

import java.util.List;
import java.util.Optional;

@Service
public class PlaylistServiceImpl implements PlaylistService {

    @Autowired
    private PlaylistRepository repository;

    @Override
    public Playlist save(Playlist playlist) {
        return repository.save(playlist);
    }

    @Override
    public Playlist update(Playlist playlist) {
        Playlist existing = repository.findById(playlist.getId())
                .orElseThrow(() -> new PlaylistNotFoundException(playlist.getId()));

        if (playlist.getName() != null) existing.setName(playlist.getName());
        if (playlist.getIsSystem() != null) existing.setIsSystem(playlist.getIsSystem());

        return repository.save(existing);
    }

    @Override
    public List<Playlist> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Playlist> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

}
