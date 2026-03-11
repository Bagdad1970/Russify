package ru.russify.russifyservice.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import ru.russify.models.PlaylistDto;
import ru.russify.models.PlaylistTrackDto;
import ru.russify.models.PlaylistWithTracks;
import ru.russify.models.projection.PlaylistTrackFlatDto;
import ru.russify.models.request.PlaylistCreateRequest;
import ru.russify.models.request.PlaylistUpdateRequest;
import ru.russify.models.response.PlaylistResponse;
import ru.russify.russifyservice.exception.PlaylistNotFoundException;
import ru.russify.russifyservice.exception.UserNotFoundException;
import ru.russify.russifyservice.mapper.PlaylistMapper;
import ru.russify.russifyservice.model.Playlist;
import ru.russify.russifyservice.model.User;
import ru.russify.russifyservice.repository.PlaylistRepository;
import ru.russify.russifyservice.repository.TrackRepository;
import ru.russify.russifyservice.repository.UserRepository;
import ru.russify.russifyservice.service.interfaces.PlaylistService;

import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PlaylistServiceImpl implements PlaylistService {

    private final UserRepository userRepository;
    private final FileStorageServiceImpl fileStorageService;
    private final PlaylistRepository playlistRepository;
    private final TrackRepository trackRepository;
    private final PlaylistMapper mapper;

    @Override
    public List<PlaylistDto> findAll() {
        return playlistRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public PlaylistDto findById(Long id) {
        return playlistRepository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new PlaylistNotFoundException(id));
    }

    @Override
    public void deleteById(Long id) {
        playlistRepository.deleteById(id);
    }

    @Override
    public PlaylistWithTracks getPlaylistWithTracks(Long playlistId){

        List<PlaylistTrackFlatDto> rows = playlistRepository.findPlaylistWithTracks(playlistId);

        if (rows.isEmpty()) {
            throw new PlaylistNotFoundException(playlistId);
        }

        PlaylistTrackFlatDto first = rows.get(0);

        List<PlaylistTrackDto> tracks = rows.stream()
                .filter(r -> r.trackId() != null)
                .map(r -> PlaylistTrackDto.builder()
                        .id(r.trackId())
                        .name(r.trackName())
                        .genreId(r.genreId())
                        .genreName(r.genreName())
                        .coverHash(r.coverHash())
                        .audioHash(r.audioHash())
                        .build())
                .toList();

        return PlaylistWithTracks.builder()
                .id(first.playlistId())
                .name(first.playlistName())
                .userId(first.userID())
                .isSystem(first.isSystem())
                .tracks(tracks)
                .build();
    }

    @Override
    @Transactional
    public PlaylistResponse createPlaylist(PlaylistCreateRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException(request.getUserId()));

        Playlist playlist = new Playlist();
        playlist.setName(request.getName());
        playlist.setUser(user);

        if (Boolean.TRUE.equals(request.getIsSystem()) && user.getRole().getName().equals("ADMIN")) {
            playlist.setIsSystem(true);
        } else {
            playlist.setIsSystem(false);
        }

        String coverHash;

        if (request.getCoverFile() != null && !request.getCoverFile().isEmpty()) {
            coverHash = fileStorageService.saveFile(request.getCoverFile());
        } else {
            coverHash = "default_playlist_cover";
        }

        playlist.setCoverHash(coverHash);

        Playlist saved = playlistRepository.save(playlist);

        return PlaylistResponse.builder()
                .id(saved.getId())
                .userId(saved.getUser().getId())
                .name(saved.getName())
                .isSystem(saved.getIsSystem())
                .coverHash(saved.getCoverHash())
                .build();

    }

    @Override
    public PlaylistDto update(
            String email,
            Long playlistId,
            PlaylistUpdateRequest request
    ) {

       HashMap userAccess = userAccessToPlaylist(email, playlistId);

        if (!(boolean) userAccess.get("isOwner") && !(boolean) userAccess.get("isAdmin")) {
            throw new AccessDeniedException("Not enough permissions");
        }

        Playlist playlist = (Playlist) userAccess.get("playlist");

        if (request.getName() != null && !request.getName().isBlank()) {
            playlist.setName(request.getName());
        }

        if (request.getIsSystem() != null && (boolean) userAccess.get("isAdmin")) {
            playlist.setIsSystem(request.getIsSystem());
        }

        if (request.getCoverFile() != null && !request.getCoverFile().isEmpty()) {

            String hash = fileStorageService.saveFile(request.getCoverFile());
            playlist.setCoverHash(hash);

        }

        return mapper.toDto(playlistRepository.save(playlist));
    }
    
    public void deletePlaylist(String email, Long playlistId) {

        HashMap userAccess = userAccessToPlaylist(email, playlistId);

        if (!(boolean) userAccess.get("isOwner") && !(boolean) userAccess.get("isAdmin")) {
            throw new AccessDeniedException("Not enough permissions");
        }

        deleteById(playlistId);
    }

    private HashMap userAccessToPlaylist(String email, Long playlistId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException());

        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new PlaylistNotFoundException(playlistId));

        HashMap userAccess = new HashMap();

        userAccess.put("user",  user);
        userAccess.put("playlist", playlist);

        boolean isOwner = playlist.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole().getName().equals("ADMIN");

        userAccess.put("isAdmin", isAdmin);
        userAccess.put("isOwner", isOwner);

        return userAccess;
    }
}