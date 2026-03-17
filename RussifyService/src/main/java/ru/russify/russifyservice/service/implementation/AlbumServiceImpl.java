package ru.russify.russifyservice.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.russify.models.AlbumDto;
import ru.russify.models.AlbumStatus;
import ru.russify.models.AlbumTypeDto;
import ru.russify.models.AuthorDto;
import ru.russify.models.TrackDto;
import ru.russify.models.projection.AlbumFlatDto;
import ru.russify.models.request.AlbumCreateRequest;
import ru.russify.models.request.AlbumUpdateRequest;
import ru.russify.russifyservice.exception.AlbumNotFoundException;
import ru.russify.russifyservice.model.Album;
import ru.russify.russifyservice.model.Author;
import ru.russify.russifyservice.model.AuthorAlbum;
import ru.russify.russifyservice.model.TrackAlbum;
import ru.russify.russifyservice.model.compositekey.AuthorAlbumPK;
import ru.russify.russifyservice.model.compositekey.TrackAlbumPK;
import ru.russify.russifyservice.repository.AlbumRepository;
import ru.russify.russifyservice.repository.AlbumTypeRepository;
import ru.russify.russifyservice.repository.AuthorRepository;
import ru.russify.russifyservice.repository.TrackRepository;
import ru.russify.russifyservice.service.interfaces.AlbumService;
import ru.russify.russifyservice.service.interfaces.FileService;

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

    public List<AlbumDto> findAllWithRelations() {
        return albumRepository.findAllAlbumsDto();
    }

    @Transactional
    public void delete(Long id){
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
            String coverHash = fileService.uploadFile("covers", request.getCoverFile());
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

            String coverHash = fileService.uploadFile("covers", request.getCoverFile());

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
}
