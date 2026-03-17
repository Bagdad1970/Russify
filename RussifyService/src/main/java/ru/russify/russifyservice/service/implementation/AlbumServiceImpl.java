package ru.russify.russifyservice.service.implementation;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.russify.models.AlbumDto;
import ru.russify.models.AlbumStatus;
import ru.russify.models.AlbumTypeDto;
import ru.russify.models.AuthorDto;
import ru.russify.models.TrackDto;
import ru.russify.models.projection.AlbumFlatDto;
import ru.russify.models.request.AlbumCreateRequest;
import ru.russify.models.request.AlbumUpdateRequest;
import ru.russify.russifyservice.exception.AlbumNotFoundException;
import ru.russify.russifyservice.exception.PlaylistNotFoundException;
import ru.russify.russifyservice.exception.UserNotFoundException;
import ru.russify.russifyservice.model.Album;
import ru.russify.russifyservice.model.Author;
import ru.russify.russifyservice.model.AuthorAlbum;
import ru.russify.russifyservice.model.Playlist;
import ru.russify.russifyservice.model.TrackAlbum;
import ru.russify.russifyservice.model.User;
import ru.russify.russifyservice.model.compositekey.AuthorAlbumPK;
import ru.russify.russifyservice.model.compositekey.TrackAlbumPK;
import ru.russify.russifyservice.repository.AlbumRepository;
import ru.russify.russifyservice.repository.AlbumTypeRepository;
import ru.russify.russifyservice.repository.AuthorRepository;
import ru.russify.russifyservice.repository.TrackRepository;
import ru.russify.russifyservice.repository.UserRepository;
import ru.russify.russifyservice.service.interfaces.AlbumService;
import ru.russify.russifyservice.service.interfaces.FileService;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Сервис для управления альбомами.
 * Позволяет сохранять, редактировать, искать и удалять альбомы.
 */

@Service
@RequiredArgsConstructor
public class AlbumServiceImpl implements AlbumService {

    private final AlbumRepository albumRepository;
    private final AlbumTypeRepository albumTypeRepository;
    private final TrackRepository trackRepository;
    private final AuthorRepository authorRepository;
    private final FileService fileService;
    private final UserRepository userRepository;

    public List<AlbumDto> findAllWithRelations() {
        return albumRepository.findAllAlbumsDto();
    }

    @Transactional
    public void delete(String email, Long id){
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new AlbumNotFoundException(id));

        checkAccess(email, album);

        albumRepository.deleteById(id);
    }

    @Transactional
    public AlbumDto createAlbum(AlbumCreateRequest request) {

        Album album = new Album();

        album.setTitle(request.getTitle());
        album.setReleasedAt(request.getReleasedAt());

        album.setAlbumType(
                albumTypeRepository.findById(request.getTypeId())
                        .orElseThrow()
        );

        album.setStatus(AlbumStatus.IN_PROGRESS);

        if (request.getCoverFile() != null) {
            String coverHash = fileService.putObject("covers", request.getCoverFile());
            album.setCoverHash(coverHash);
        }

        album.setTrackAlbums(new HashSet<>());
        album.setAuthorAlbums(new HashSet<>());

        Album savedAlbum = albumRepository.save(album);

        if (request.getTrackIds() != null) {

            for (Long trackId : request.getTrackIds()) {

                TrackAlbum trackAlbum = new TrackAlbum(
                        new TrackAlbumPK(trackId, savedAlbum.getId()),
                        trackRepository.getReferenceById(trackId),
                        savedAlbum
                );

                savedAlbum.getTrackAlbums().add(trackAlbum);
            }
        }

        Author author = authorRepository.getReferenceById(request.getAuthorId());

        AuthorAlbum authorAlbum = new AuthorAlbum(
                new AuthorAlbumPK(author.getId(), savedAlbum.getId()),
                author,
                savedAlbum
        );

        savedAlbum.getAuthorAlbums().add(authorAlbum);

        Album result = albumRepository.save(savedAlbum);

        return getAlbumById(result.getId());
    }

    @Transactional
    public AlbumDto updateAlbum(Long id, AlbumUpdateRequest request) {

        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new AlbumNotFoundException(id));

        if (request.getTitle() != null) {
            album.setTitle(request.getTitle());
        }

        if (request.getReleasedAt() != null) {
            album.setReleasedAt(request.getReleasedAt());
        }

        if (request.getStatus() != null) {
            album.setStatus(request.getStatus());
        }

        if (request.getTypeId() != null) {
            album.setAlbumType(
                    albumTypeRepository.findById(request.getTypeId())
                            .orElseThrow()
            );
        }

        if (request.getCoverFile() != null) {

            String coverHash = fileService.putObject("covers", request.getCoverFile());

            album.setCoverHash(coverHash);
        }

        if (request.getAuthorId() != null) {

            album.getAuthorAlbums().clear();

            Author author = authorRepository.getReferenceById(request.getAuthorId());

            AuthorAlbum authorAlbum = new AuthorAlbum(
                    new AuthorAlbumPK(author.getId(), album.getId()),
                    author,
                    album
            );

            album.getAuthorAlbums().add(authorAlbum);
        }

        albumRepository.save(album);

        return getAlbumById(album.getId());
    }

    /**
     * Метод сохранения альбома в бд.
     *
     * @param album - экземпляр класса {@code Album }
     * @return
     */
    @Override
    public Album save(Album album) {
        return albumRepository.save(album);
    }

    @Override
    public Album update(Album album) {
        Album existing = albumRepository.findById(album.getId())
                .orElseThrow(() -> new AlbumNotFoundException(album.getId()));

        if (album.getTitle() != null) existing.setTitle(album.getTitle());
        if (album.getAlbumType() != null) existing.setAlbumType(album.getAlbumType());
        if (album.getReleasedAt() != null) existing.setReleasedAt(album.getReleasedAt());

        return albumRepository.save(existing);
    }

    @Override
    public List<Album> findAll() {
        return albumRepository.findAll();
    }

    @Override
    public Optional<Album> findById(Long id) {
        return albumRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        albumRepository.deleteById(id);
    }

    public List<AlbumDto> findAlbumsByUser(String email){
        return albumRepository.findAlbumsByAuthorEmail(email);
    }

    public AlbumDto getAlbumById(Long albumId) {

        List<AlbumFlatDto> rows = albumRepository.findAlbumFlatById(albumId);

        if (rows.isEmpty()) {
            throw new AlbumNotFoundException(albumId);
        }

        AlbumFlatDto first = rows.get(0);

        Set<TrackDto> tracks = rows.stream()
                .filter(r -> r.getTrackId() != null)
                .map(r -> TrackDto.builder()
                        .id(r.getTrackId())
                        .name(r.getTrackName())
                        .genreId(r.getGenreId())
                        .coverHash(r.getTrackCoverHash())
                        .audioHash(r.getAudioHash())
                        .build())
                .collect(Collectors.toSet());

        Set<AuthorDto> authors = rows.stream()
                .filter(r -> r.getAuthorId() != null)
                .map(r -> AuthorDto.builder()
                        .id(r.getAuthorId())
                        .name(r.getAuthorName())
                        .photoHash(r.getAuthorPhotoHash())
                        .description(r.getAuthorDescription())
                        .build())
                .collect(Collectors.toSet());

        AlbumTypeDto type = new AlbumTypeDto();
        type.setName(first.getTypeName());

        return AlbumDto.builder()
                .id(first.getId())
                .title(first.getTitle())
                .type(type)
                .status(first.getStatus())
                .releasedAt(first.getReleasedAt())
                .coverHash(first.getCoverHash())
                .tracks(tracks)
                .authors(authors)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AlbumDto> getFavouriteAlbums(String email) {
        return albumRepository.findFavouriteAlbumsByUserEmail(email);
    }

    @Transactional
    public AlbumDto updateUserAlbum(String email, Long albumId, AlbumUpdateRequest request) {

        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new AlbumNotFoundException(albumId));

        checkAccess(email, album);

        if (request.getTitle() != null) {
            album.setTitle(request.getTitle());
        }

        if (request.getReleasedAt() != null) {
            album.setReleasedAt(request.getReleasedAt());
        }

        if (request.getTypeId() != null) {
            album.setAlbumType(
                    albumTypeRepository.findById(request.getTypeId())
                            .orElseThrow()
            );
        }

        if (request.getCoverFile() != null) {
            String coverHash = fileService.putObject("covers", request.getCoverFile());
            album.setCoverHash(coverHash);
        }

        if (request.getAuthorId() != null) {
            album.getAuthorAlbums().clear();

            Author author = authorRepository.getReferenceById(request.getAuthorId());

            AuthorAlbum authorAlbum = new AuthorAlbum(
                    new AuthorAlbumPK(author.getId(), album.getId()),
                    author,
                    album
            );

            album.getAuthorAlbums().add(authorAlbum);
        }

        if (request.getTrackIds() != null) {

            Set<Long> existingTrackIds = album.getTrackAlbums().stream()
                    .map(ta -> ta.getTrack().getId())
                    .collect(Collectors.toSet());

            Set<Long> newTrackIds = new HashSet<>(request.getTrackIds());

            boolean tracksAdded = !existingTrackIds.containsAll(newTrackIds);
            boolean tracksRemoved = !newTrackIds.containsAll(existingTrackIds);

            album.getTrackAlbums().clear();

            for (Long trackId : newTrackIds) {

                TrackAlbum ta = new TrackAlbum(
                        new TrackAlbumPK(trackId, album.getId()),
                        trackRepository.getReferenceById(trackId),
                        album
                );

                album.getTrackAlbums().add(ta);
            }

            if (tracksAdded) {
                album.setStatus(AlbumStatus.IN_PROGRESS);
            }
        }

        albumRepository.save(album);

        return getAlbumById(album.getId());
    }

    private void checkAccess(String email, Album album) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException());

        if ("ADMIN".equals(user.getRole().getName())) {
            return;
        }

        boolean isOwner = album.getAuthorAlbums().stream()
                .anyMatch(aa -> aa.getAuthor().getUser().getId().equals(user.getId()));

        if (isOwner) {
            return;
        }

        throw new AccessDeniedException("Access denied");
    }
}
