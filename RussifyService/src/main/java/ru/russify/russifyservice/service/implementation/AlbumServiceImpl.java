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
import ru.russify.russifyservice.exception.AlbumNotFoundException;
import ru.russify.russifyservice.exception.BadRequestException;
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
    private final AudioMetadataServiceImpl audioMetadataService;

    public List<AlbumDto> findAllWithRelations() {
        return albumRepository.findAllAlbumsDto();
    }

    public List<AlbumDto> findPublicWithRelations() {
        return findAllWithRelations().stream()
                .filter(album -> album.getStatus() == AlbumStatus.APPROVED)
                .toList();
    }

    public List<AlbumDto> findAllManaged(String email) {
        requireAdmin(email);
        return findAllWithRelations();
    }

    public List<AlbumDto> findModerationQueue(String email) {
        requireAdmin(email);
        return findAllWithRelations().stream()
                .filter(album -> album.getStatus() == AlbumStatus.IN_PROGRESS)
                .toList();
    }

    @Transactional
    public void delete(String email, Long id){
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new AlbumNotFoundException(id));

        checkAccess(email, album);

        albumRepository.deleteById(id);
    }

    @Transactional
    public AlbumDto createAlbum(String email, AlbumCreateRequest request) {
        requireAdmin(email);
        ensureAuthorProvided(request.getAuthorId());
        validateTrackPayload(
                request.getTrackNames(),
                request.getTrackGenreIds(),
                request.getTrackAudioFiles(),
                request.getTrackAuthorIds()
        );

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

        linkAlbumAuthor(savedAlbum, authorRepository.getReferenceById(request.getAuthorId()));
        attachUploadedTracks(
                savedAlbum,
                request.getTrackNames(),
                request.getTrackGenreIds(),
                request.getTrackAudioFiles(),
                request.getTrackAuthorIds()
        );

        Album result = albumRepository.save(savedAlbum);

        return getAlbumById(result.getId());
    }

    @Transactional
    public AlbumDto updateAlbum(String email, Long id, AlbumUpdateRequest request) {
        requireAdmin(email);

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

    public AlbumDto getAlbumByIdVisibleTo(Long albumId, String email) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new AlbumNotFoundException(albumId));

        if (album.getStatus() == AlbumStatus.APPROVED) {
            return getAlbumById(albumId);
        }

        if (email == null || email.isBlank()) {
            throw new AccessDeniedException("Access denied");
        }

        checkAccess(email, album);
        return getAlbumById(albumId);
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
                        .duration(r.getDuration())
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

        User user = userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new AlbumNotFoundException(albumId));

        checkAccess(user, album);

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

            linkAlbumAuthor(album, resolveOwnedAuthor(user, request.getAuthorId()));
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

    @Transactional
    public AlbumDto publishAlbum(String email, AlbumCreateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);
        Author author = resolveOwnedAuthor(user, request.getAuthorId());

        validateTrackPayload(
                request.getTrackNames(),
                request.getTrackGenreIds(),
                request.getTrackAudioFiles(),
                request.getTrackAuthorIds()
        );

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
        linkAlbumAuthor(savedAlbum, author);
        attachUploadedTracksForUser(
                savedAlbum,
                user,
                request.getTrackNames(),
                request.getTrackGenreIds(),
                request.getTrackAudioFiles(),
                request.getTrackAuthorIds()
        );

        Album result = albumRepository.save(savedAlbum);

        return getAlbumById(result.getId());
    }

    private void checkAccess(String email, Album album) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);
        checkAccess(user, album);
    }

    private void checkAccess(User user, Album album) {
        if (isAdmin(user) || isAlbumOwner(user, album)) {
            return;
        }

        throw new AccessDeniedException("Access denied");
    }

    private void requireAdmin(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        if (!isAdmin(user)) {
            throw new AccessDeniedException("Access denied");
        }
    }

    private void ensureAuthorProvided(Long authorId) {
        if (authorId == null) {
            throw new BadRequestException("Author id is required");
        }
    }

    private void validateTrackPayload(
            List<String> trackNames,
            List<Long> trackGenreIds,
            List<MultipartFile> trackAudioFiles,
            List<Long> trackAuthorIds
    ) {
        if (trackNames == null || trackNames.isEmpty()) {
            throw new BadRequestException("Album must contain tracks");
        }

        if (trackGenreIds == null || trackAudioFiles == null || trackAuthorIds == null) {
            throw new BadRequestException("Track payload is incomplete");
        }

        if (
                trackNames.size() != trackGenreIds.size()
                        || trackNames.size() != trackAudioFiles.size()
                        || trackNames.size() != trackAuthorIds.size()
        ) {
            throw new BadRequestException("Track arrays size mismatch");
        }
    }

    private void linkAlbumAuthor(Album album, Author author) {
        album.getAuthorAlbums().add(new AuthorAlbum(
                new AuthorAlbumPK(author.getId(), album.getId()),
                author,
                album
        ));
    }

    private void attachUploadedTracks(
            Album album,
            List<String> trackNames,
            List<Long> trackGenreIds,
            List<MultipartFile> trackAudioFiles,
            List<Long> trackAuthorIds
    ) {
        for (int i = 0; i < trackNames.size(); i++) {
            String name = trackNames.get(i);
            Long genreId = trackGenreIds.get(i);
            MultipartFile audioFile = trackAudioFiles.get(i);
            Long authorId = trackAuthorIds.get(i);

            String audioHash = fileService.uploadFile("music", audioFile);
            int duration = audioMetadataService.extractDurationSeconds(audioFile);

            Track track = Track.builder()
                    .name(name)
                    .genre(genreRepository.getReferenceById(genreId))
                    .audioHash(audioHash)
                    .duration(duration)
                    .build();

            Track savedTrack = trackRepository.save(track);

            album.getTrackAlbums().add(new TrackAlbum(
                    new TrackAlbumPK(savedTrack.getId(), album.getId()),
                    savedTrack,
                    album
            ));

            Author trackAuthor = authorRepository.getReferenceById(authorId);
            savedTrack.getAuthorTracks().add(new AuthorTrack(
                    new AuthorTrackPK(trackAuthor.getId(), savedTrack.getId()),
                    trackAuthor,
                    savedTrack
            ));
        }
    }

    private void attachUploadedTracksForUser(
            Album album,
            User user,
            List<String> trackNames,
            List<Long> trackGenreIds,
            List<MultipartFile> trackAudioFiles,
            List<Long> trackAuthorIds
    ) {
        for (int i = 0; i < trackNames.size(); i++) {
            String name = trackNames.get(i);
            Long genreId = trackGenreIds.get(i);
            MultipartFile audioFile = trackAudioFiles.get(i);
            Long authorId = trackAuthorIds.get(i);

            String audioHash = fileService.uploadFile("music", audioFile);
            int duration = audioMetadataService.extractDurationSeconds(audioFile);

            Track track = Track.builder()
                    .name(name)
                    .genre(genreRepository.getReferenceById(genreId))
                    .audioHash(audioHash)
                    .duration(duration)
                    .build();

            Track savedTrack = trackRepository.save(track);

            album.getTrackAlbums().add(new TrackAlbum(
                    new TrackAlbumPK(savedTrack.getId(), album.getId()),
                    savedTrack,
                    album
            ));

            Author trackAuthor = resolveOwnedAuthor(user, authorId);
            savedTrack.getAuthorTracks().add(new AuthorTrack(
                    new AuthorTrackPK(trackAuthor.getId(), savedTrack.getId()),
                    trackAuthor,
                    savedTrack
            ));
        }
    }

    private Author resolveOwnedAuthor(User user, Long requestedAuthorId) {
        if (requestedAuthorId != null) {
            Author requestedAuthor = authorRepository.findById(requestedAuthorId)
                    .orElseThrow(() -> new BadRequestException("Author not found"));

            if (isAdmin(user) || isOwnedByUser(user, requestedAuthor)) {
                return requestedAuthor;
            }
        }

        if (user.getAuthors() != null && !user.getAuthors().isEmpty()) {
            return user.getAuthors().iterator().next();
        }

        Author author = Author.builder()
                .name(user.getUsername())
                .user(user)
                .build();

        return authorRepository.save(author);
    }

    private boolean isAlbumOwner(User user, Album album) {
        return album.getAuthorAlbums() != null
                && album.getAuthorAlbums().stream()
                .map(AuthorAlbum::getAuthor)
                .anyMatch(author -> isOwnedByUser(user, author));
    }

    private boolean isOwnedByUser(User user, Author author) {
        return author.getUser() != null && author.getUser().getId().equals(user.getId());
    }

    private boolean isAdmin(User user) {
        return user.getRole() != null && "ADMIN".equalsIgnoreCase(user.getRole().getName());
    }
}
