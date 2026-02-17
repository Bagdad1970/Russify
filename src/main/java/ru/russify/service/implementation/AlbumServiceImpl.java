package ru.russify.service.implementation;

import org.springframework.stereotype.Service;
import ru.russify.exception.AlbumNotFoundException;
import ru.russify.model.Album;
import ru.russify.repository.AlbumRepository;
import ru.russify.service.interfaces.AlbumService;

import java.util.List;
import java.util.Optional;

@Service
public class AlbumServiceImpl implements AlbumService {

    private final AlbumRepository repository;

    public AlbumServiceImpl(AlbumRepository repository) {
        this.repository = repository;
    }

    @Override
    public Album save(Album album) {
        return repository.save(album);
    }

    @Override
    public Album update(Album album) {
        Album existing = repository.findById(album.getId())
                .orElseThrow(() -> new AlbumNotFoundException(album.getId()));

        if (album.getTitle() != null) existing.setTitle(album.getTitle());
        if (album.getAlbumType() != null) existing.setAlbumType(album.getAlbumType());
        if (album.getReleasedAt() != null) existing.setReleasedAt(album.getReleasedAt());

        return repository.save(existing);
    }

    @Override
    public List<Album> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Album> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

}
