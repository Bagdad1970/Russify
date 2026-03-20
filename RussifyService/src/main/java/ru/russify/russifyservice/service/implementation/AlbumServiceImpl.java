package ru.russify.russifyservice.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.russify.models.AlbumDto;
import ru.russify.models.AlbumStatus;
import ru.russify.models.AlbumTypeDto;
import ru.russify.models.AuthorDto;
import ru.russify.models.TrackDto;
import ru.russify.models.projection.AlbumFlatDto;
import ru.russify.models.request.album.AlbumCreateRequest;
import ru.russify.models.request.album.AlbumUpdateRequest;
import ru.russify.models.request.track.TrackCreateRequest;
import ru.russify.russifyservice.exception.AlbumNotFoundException;
import ru.russify.russifyservice.exception.UserNotFoundException;
import ru.russify.russifyservice.model.Album;
import ru.russify.russifyservice.model.Author;
import ru.russify.russifyservice.model.AuthorAlbum;
import ru.russify.russifyservice.model.AuthorTrack;
import ru.russify.russifyservice.model.Track;
import ru.russify.russifyservice.model.TrackAlbum;
import ru.russify.russifyservice.model.User;
import ru.russify.russifyservice.model.compositekey.AuthorAlbumPK;
import ru.russify.russifyservice.model.compositekey.AuthorTrackPK;
import ru.russify.russifyservice.model.compositekey.TrackAlbumPK;
import ru.russify.russifyservice.repository.AlbumRepository;
import ru.russify.russifyservice.repository.AlbumTypeRepository;
import ru.russify.russifyservice.repository.AuthorRepository;
import ru.russify.russifyservice.repository.GenreRepository;
import ru.russify.russifyservice.repository.TrackRepository;
import ru.russify.russifyservice.repository.UserRepository;
import ru.russify.russifyservice.service.interfaces.AlbumService;
import ru.russify.russifyservice.service.interfaces.FileService;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlbumServiceImpl implements AlbumService {

    private final AlbumRepository albumRepository;
    private final AlbumTypeRepository albumTypeRepository;
    private final TrackRepository trackRepository;
    private final AuthorRepository authorRepository;
    private final FileService fileService;
    private final UserRepository userRepository;
    private final GenreRepository genreRepository;

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
            String coverHash = fileService.uploadFile("images", request.getCoverFile());
            album.setCoverHash(coverHash);
        }

        album.setTrackAlbums(new HashSet<>());
        album.setAuthorAlbums(new HashSet<>());

        Album savedAlbum = albumRepository.save(album);

        Author albumAuthor = authorRepository.getReferenceById(request.getAuthorId());

        AuthorAlbum authorAlbum = new AuthorAlbum(
                new AuthorAlbumPK(albumAuthor.getId(), savedAlbum.getId()),
                albumAuthor,
                savedAlbum
        );

        savedAlbum.getAuthorAlbums().add(authorAlbum);

        List<String> trackNames = request.getTrackNames();
        List<Long> trackGenreIds = request.getTrackGenreIds();
        List<MultipartFile> trackAudioFiles = request.getTrackAudioFiles();
        List<Long> trackAuthorIds = request.getTrackAuthorIds();

        if (trackNames != null) {

            for (int i = 0; i < trackNames.size(); i++) {

                String name = trackNames.get(i);
                Long genreId = trackGenreIds.get(i);
                MultipartFile audioFile = trackAudioFiles.get(i);
                Long authorId = trackAuthorIds.get(i);

                String audioHash = fileService.uploadFile("music", audioFile);

                Track track = Track.builder()
                        .name(name)
                        .genre(genreRepository.getReferenceById(genreId))
                        .audioHash(audioHash)
                        .build();

                Track savedTrack = trackRepository.save(track);

                TrackAlbum trackAlbum = new TrackAlbum(
                        new TrackAlbumPK(savedTrack.getId(), savedAlbum.getId()),
                        savedTrack,
                        savedAlbum
                );

                savedAlbum.getTrackAlbums().add(trackAlbum);

                Author author = authorRepository.getReferenceById(authorId);

                AuthorTrack authorTrack = new AuthorTrack(
                        new AuthorTrackPK(author.getId(), savedTrack.getId()),
                        author,
                        savedTrack
                );

                savedTrack.getAuthorTracks().add(authorTrack);
            }
        }

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

            String coverHash = fileService.uploadFile("images", request.getCoverFile());

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
            String coverHash = fileService.uploadFile("images", request.getCoverFile());
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

    @Transactional
    public AlbumDto publishAlbum(String email, AlbumCreateRequest request) {

        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole().getName());
        boolean isOwner = author.getUser().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("Access denied");
        }

        List<String> trackNames = request.getTrackNames();

        if (trackNames == null || trackNames.isEmpty()) {
            throw new RuntimeException("Album must contain tracks");
        }

        Album album = new Album();

        album.setTitle(request.getTitle());
        album.setReleasedAt(request.getReleasedAt());

        album.setAlbumType(
                albumTypeRepository.findById(request.getTypeId())
                        .orElseThrow()
        );

        album.setStatus(AlbumStatus.IN_PROGRESS);

        if (request.getCoverFile() != null) {
            String coverHash = fileService.uploadFile("images", request.getCoverFile());
            album.setCoverHash(coverHash);
        }

        album.setTrackAlbums(new HashSet<>());
        album.setAuthorAlbums(new HashSet<>());

        Album savedAlbum = albumRepository.save(album);

        AuthorAlbum authorAlbum = new AuthorAlbum(
                new AuthorAlbumPK(author.getId(), savedAlbum.getId()),
                author,
                savedAlbum
        );

        savedAlbum.getAuthorAlbums().add(authorAlbum);

        List<Long> trackGenreIds = request.getTrackGenreIds();
        List<MultipartFile> trackAudioFiles = request.getTrackAudioFiles();
        List<Long> trackAuthorIds = request.getTrackAuthorIds();

        if (
                trackNames.size() != trackGenreIds.size() ||
                        trackNames.size() != trackAudioFiles.size() ||
                        trackNames.size() != trackAuthorIds.size()
        ) {
            throw new RuntimeException("Track arrays size mismatch");
        }

        for (int i = 0; i < trackNames.size(); i++) {

            String name = trackNames.get(i);
            Long genreId = trackGenreIds.get(i);
            MultipartFile audioFile = trackAudioFiles.get(i);
            Long authorId = trackAuthorIds.get(i);

            String audioHash = fileService.uploadFile("audio", audioFile);

            Track track = Track.builder()
                    .name(name)
                    .genre(genreRepository.getReferenceById(genreId))
                    .audioHash(audioHash)
                    .build();

            Track savedTrack = trackRepository.save(track);

            TrackAlbum trackAlbum = new TrackAlbum(
                    new TrackAlbumPK(savedTrack.getId(), savedAlbum.getId()),
                    savedTrack,
                    savedAlbum
            );

            savedAlbum.getTrackAlbums().add(trackAlbum);

            Author trackAuthor = authorRepository.getReferenceById(authorId);

            AuthorTrack authorTrack = new AuthorTrack(
                    new AuthorTrackPK(trackAuthor.getId(), savedTrack.getId()),
                    trackAuthor,
                    savedTrack
            );

            savedTrack.getAuthorTracks().add(authorTrack);
        }

        Album result = albumRepository.save(savedAlbum);

        return getAlbumById(result.getId());
    }
}
