package ru.russify.russifyservice.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.russify.models.TrackDto;
import ru.russify.models.projection.TrackFlatDto;
import ru.russify.models.request.track.TrackCreateRequest;
import ru.russify.models.request.track.TrackResponse;
import ru.russify.models.request.track.TrackSearchRequest;
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
import ru.russify.russifyservice.specification.TrackSpecification;

import java.util.List;
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
    private final FileServiceImpl fileService;
    private final TrackMapper mapper;

    @Override
    public TrackResponse create(TrackCreateRequest request) {
        Track track = new Track();

        track.setGenre(
                genreRepository.getReferenceById(request.getGenreId())
        );

        if (request.getAlbumIds() != null) {
            track.setTrackAlbums(
                    request.getAlbumIds().stream()
                            .map(albumId -> new TrackAlbum(
                                    new TrackAlbumPK(null, albumId),
                                    track,
                                    albumRepository.getReferenceById(albumId)
                            ))
                            .collect(Collectors.toSet())
            );
        }

        if (request.getAuthorIds() != null) {
            track.setAuthorTracks(
                    request.getAuthorIds().stream()
                            .map(authorId -> new AuthorTrack(
                                    new AuthorTrackPK(authorId, null),
                                    authorRepository.getReferenceById(authorId),
                                    track
                            ))
                            .collect(Collectors.toSet())
            );
        }

        String audioHash = fileService.uploadFile(
                "music",
                request.getAudioFile()
        );

        track.setAudioHash(audioHash);

        Track saved = repository.save(track);

        return TrackResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .albumIds(request.getAlbumIds())
                .authorIds(request.getAuthorIds())
                .coverHash(saved.getCoverHash())
                .build();
    }

    @Override
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

    @Override
    public TrackDto findById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new TrackNotFoundException(id));
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<TrackFlatDto> searchTracks(TrackSearchRequest request) {

        System.out.println(request.genreIds());

        var spec = TrackSpecification.filter(
                request.name(),
                request.genreIds()
        );

        return repository.findAll(spec)
                .stream()
                .map(track -> new TrackFlatDto(
                        track.getId(),
                        track.getName(),
                        track.getGenre().getId(),
                        track.getGenre().getName(),
                        track.getCoverHash(),
                        track.getAudioHash()
                ))
                .toList();
    }
}
