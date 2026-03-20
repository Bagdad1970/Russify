package ru.russify.russifyservice.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import ru.russify.models.TrackDto;
import ru.russify.models.projection.TrackFlatDto;
import ru.russify.models.request.track.TrackCreateRequest;
import ru.russify.models.request.track.TrackResponse;
import ru.russify.models.request.track.TrackSearchRequest;
import ru.russify.russifyservice.exception.AlbumNotFoundException;
import ru.russify.russifyservice.exception.BadRequestException;
import ru.russify.russifyservice.exception.TrackNotFoundException;
import ru.russify.russifyservice.mapper.TrackMapper;
import ru.russify.russifyservice.model.Album;
import ru.russify.russifyservice.model.AuthorTrack;
import ru.russify.russifyservice.model.Track;
import ru.russify.russifyservice.model.TrackAlbum;
import ru.russify.russifyservice.model.User;
import ru.russify.russifyservice.model.compositekey.AuthorTrackPK;
import ru.russify.russifyservice.model.compositekey.TrackAlbumPK;
import ru.russify.russifyservice.repository.AlbumRepository;
import ru.russify.russifyservice.repository.AuthorRepository;
import ru.russify.russifyservice.repository.GenreRepository;
import ru.russify.russifyservice.repository.TrackRepository;
import ru.russify.russifyservice.repository.UserRepository;
import ru.russify.russifyservice.service.interfaces.TrackService;
import ru.russify.russifyservice.specification.TrackSpecification;

import java.util.HashSet;
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
    private final UserRepository userRepository;
    private final FileServiceImpl fileService;
    private final TrackMapper mapper;

    @Override
    public TrackResponse create(String email, TrackCreateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(ru.russify.russifyservice.exception.UserNotFoundException::new);

        ensureAlbumsSelected(request.getAlbumIds());
        validateAlbumAccess(user, request.getAlbumIds());

        Track track = new Track();

        track.setName(request.getName());

        track.setGenre(
                genreRepository.getReferenceById(request.getGenreId())
        );

        track.setTrackAlbums(
                request.getAlbumIds().stream()
                        .map(albumId -> new TrackAlbum(
                                new TrackAlbumPK(null, albumId),
                                track,
                                albumRepository.getReferenceById(albumId)
                        ))
                        .collect(Collectors.toSet())
        );

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

        if (request.getCoverFile() != null && !request.getCoverFile().isEmpty()) {
            track.setCoverHash(fileService.uploadFile("images", request.getCoverFile()));
        }

        Track saved = repository.save(track);

        return toTrackResponse(saved);
    }

    @Override
    public TrackDto update(String email, Long id, TrackDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(ru.russify.russifyservice.exception.UserNotFoundException::new);

        Track track = repository.findById(id)
                .orElseThrow(() -> new TrackNotFoundException(id));

        checkTrackAccess(user, track);
        mapper.updateEntity(dto, track);

        if (dto.getName() != null && !dto.getName().isBlank()) {
            track.setName(dto.getName());
        }

        if (dto.getGenreId() != null) {
            track.setGenre(genreRepository.getReferenceById(dto.getGenreId()));
        }

        if (dto.getAlbumIds() != null) {
            ensureAlbumsSelected(dto.getAlbumIds());
            validateAlbumAccess(user, dto.getAlbumIds());

            if (track.getTrackAlbums() == null) {
                track.setTrackAlbums(new HashSet<>());
            } else {
                track.getTrackAlbums().clear();
            }

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
            if (track.getAuthorTracks() == null) {
                track.setAuthorTracks(new HashSet<>());
            } else {
                track.getAuthorTracks().clear();
            }

            Set<AuthorTrack> authors = dto.getAuthorIds().stream()
                    .map(authorId -> new AuthorTrack(
                            new AuthorTrackPK(authorId, id),
                            authorRepository.getReferenceById(authorId),
                            track
                    ))
                    .collect(Collectors.toSet());

            track.getAuthorTracks().addAll(authors);
        }

        return toTrackDto(repository.save(track));
    }

    @Override
    public TrackDto findById(Long id) {
        return repository.findById(id)
                .map(this::toTrackDto)
                .orElseThrow(() -> new TrackNotFoundException(id));
    }

    @Override
    public void deleteById(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(ru.russify.russifyservice.exception.UserNotFoundException::new);

        Track track = repository.findById(id)
                .orElseThrow(() -> new TrackNotFoundException(id));

        checkTrackAccess(user, track);
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

    private TrackDto toTrackDto(Track track) {
        return TrackDto.builder()
                .id(track.getId())
                .albumIds(albumIds(track))
                .authorIds(authorIds(track))
                .coverHash(track.getCoverHash())
                .audioHash(track.getAudioHash())
                .duration(track.getDuration())
                .name(track.getName())
                .genreId(track.getGenre() != null ? track.getGenre().getId() : null)
                .build();
    }

    private TrackResponse toTrackResponse(Track track) {
        return TrackResponse.builder()
                .id(track.getId())
                .albumIds(albumIds(track))
                .authorIds(authorIds(track))
                .name(track.getName())
                .coverHash(track.getCoverHash())
                .audioHash(track.getAudioHash())
                .genreId(track.getGenre() != null ? track.getGenre().getId() : null)
                .build();
    }

    private Set<Long> albumIds(Track track) {
        if (track.getTrackAlbums() == null) {
            return Set.of();
        }

        return track.getTrackAlbums().stream()
                .map(trackAlbum -> trackAlbum.getAlbum().getId())
                .collect(Collectors.toSet());
    }

    private Set<Long> authorIds(Track track) {
        if (track.getAuthorTracks() == null) {
            return Set.of();
        }

        return track.getAuthorTracks().stream()
                .map(authorTrack -> authorTrack.getAuthor().getId())
                .collect(Collectors.toSet());
    }

    private void ensureAlbumsSelected(Set<Long> albumIds) {
        if (albumIds == null || albumIds.isEmpty()) {
            throw new BadRequestException("Track must belong to at least one album");
        }
    }

    private void validateAlbumAccess(User user, Set<Long> albumIds) {
        if (isAdmin(user)) {
            return;
        }

        boolean hasDeniedAlbum = albumIds.stream()
                .map(this::findAlbumOrThrow)
                .anyMatch(album -> !isAlbumOwner(user, album));

        if (hasDeniedAlbum) {
            throw new AccessDeniedException("Access denied");
        }
    }

    private void checkTrackAccess(User user, Track track) {
        if (isAdmin(user)) {
            return;
        }

        boolean ownsTrack = track.getTrackAlbums() != null
                && track.getTrackAlbums().stream()
                .map(TrackAlbum::getAlbum)
                .anyMatch(album -> isAlbumOwner(user, album));

        if (!ownsTrack) {
            throw new AccessDeniedException("Access denied");
        }
    }

    private Album findAlbumOrThrow(Long albumId) {
        return albumRepository.findById(albumId)
                .orElseThrow(() -> new AlbumNotFoundException(albumId));
    }

    private boolean isAlbumOwner(User user, Album album) {
        return album.getAuthorAlbums() != null
                && album.getAuthorAlbums().stream()
                .anyMatch(authorAlbum -> authorAlbum.getAuthor().getUser() != null
                        && authorAlbum.getAuthor().getUser().getId().equals(user.getId()));
    }

    private boolean isAdmin(User user) {
        return user.getRole() != null && "ADMIN".equalsIgnoreCase(user.getRole().getName());
    }
}
