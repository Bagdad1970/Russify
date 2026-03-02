package ru.russify.russifyservice.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.russify.russifyservice.dto.TrackDto;
import ru.russify.russifyservice.dto.projection.TrackFlatDto;
import ru.russify.russifyservice.exception.TrackNotFoundException;
import ru.russify.russifyservice.mapper.TrackMapper;
import ru.russify.russifyservice.model.AuthorTrack;
import ru.russify.russifyservice.model.Track;
import ru.russify.russifyservice.model.TrackAlbum;
import ru.russify.russifyservice.model.compositekey.AuthorTrackPK;
import ru.russify.russifyservice.model.compositekey.TrackAlbumPK;
import ru.russify.russifyservice.repository.AlbumRepository;
import ru.russify.russifyservice.repository.AuthorRepository;
import ru.russify.russifyservice.repository.GenreRepository;
import ru.russify.russifyservice.repository.TrackRepository;
import ru.russify.russifyservice.service.interfaces.TrackService;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TrackServiceImpl implements TrackService {

    private final TrackRepository repository;
    private final GenreRepository genreRepository;
    private final AlbumRepository albumRepository;
    private final AuthorRepository authorRepository;
    private final TrackMapper mapper;

    public TrackDto create(TrackDto dto) {

        Track track = mapper.toEntity(dto);

        track.setGenre(
                genreRepository.getReferenceById(dto.getGenreId())
        );

        if (dto.getAlbumIds() != null) {
            track.setTrackAlbums(
                    dto.getAlbumIds().stream()
                            .map(albumId -> new TrackAlbum(
                                    new TrackAlbumPK(null, albumId),
                                    track,
                                    albumRepository.getReferenceById(albumId)
                            ))
                            .collect(Collectors.toSet())
            );
        }

        if (dto.getAuthorIds() != null) {
            track.setAuthorTracks(
                    dto.getAuthorIds().stream()
                            .map(authorId -> new AuthorTrack(
                                    new AuthorTrackPK(authorId, null),
                                    authorRepository.getReferenceById(authorId),
                                    track
                            ))
                            .collect(Collectors.toSet())
            );
        }

        return mapper.toDto(repository.save(track));
    }

    public TrackDto update(Long id, TrackDto dto) {

        Track track = repository.findById(id)
                .orElseThrow(() -> new TrackNotFoundException(id));

        mapper.updateEntity(dto, track);

        if (dto.getGenreId() != null) {
            track.setGenre(genreRepository.getReferenceById(dto.getGenreId()));
        }

        if (dto.getAlbumIds() != null) {
            track.getTrackAlbums().clear();

            Set<TrackAlbum> albums = dto.getAlbumIds().stream()
                    .map(albumId -> new TrackAlbum(
                            new TrackAlbumPK(id, albumId),
                            track,
                            albumRepository.getReferenceById(albumId)
                    ))
                    .collect(Collectors.toSet());

            track.getTrackAlbums().addAll(albums);
        }

        if (dto.getAuthorIds() != null) {
            track.getAuthorTracks().clear();

            Set<AuthorTrack> authors = dto.getAuthorIds().stream()
                    .map(authorId -> new AuthorTrack(
                            new AuthorTrackPK(authorId, id),
                            authorRepository.getReferenceById(authorId),
                            track
                    ))
                    .collect(Collectors.toSet());

            track.getAuthorTracks().addAll(authors);
        }

        return mapper.toDto(repository.save(track));
    }

    public List<TrackDto> findAllDto() {
        List<TrackFlatDto> flat = repository.findAllFlat();

        Map<Long, TrackDto> grouped = new LinkedHashMap<>();

        for (TrackFlatDto row : flat) {

            grouped.putIfAbsent(
                    row.id(),
                    new TrackDto(
                            row.id(),
                            new HashSet<>(),
                            new HashSet<>(),
                            row.name(),
                            row.genreId(),
                            row.coverFilepath(),
                            row.audioFilepath()
                    )
            );

            TrackDto dto = grouped.get(row.id());

            if (row.albumId() != null)
                dto.getAlbumIds().add(row.albumId());

            if (row.authorId() != null)
                dto.getAuthorIds().add(row.authorId());
        }

        return new ArrayList<>(grouped.values());
    }

    public TrackDto findByIdDto(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new TrackNotFoundException(id));
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
