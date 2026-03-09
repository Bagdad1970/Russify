package ru.russify.russifyservice.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.russify.models.PlaylistDto;
import ru.russify.models.PlaylistTrackDto;
import ru.russify.models.PlaylistWithTracks;
import ru.russify.models.projection.PlaylistTrackFlatDto;
import ru.russify.models.request.PlaylistCreateRequest;
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
    public PlaylistDto create(PlaylistDto dto) {

        Playlist playlist = mapper.toEntity(dto);

        playlist.setUser(
                userRepository.getReferenceById(dto.getUserId())
        );

//        if (dto.getTrackIds() != null) {
//            playlist.setTrackPlaylists(
//                    dto.getTrackIds().stream()
//                            .map(trackId -> new TrackPlaylist(
//                                    new TrackPlaylistPK(null, trackId),
//                                    playlist,
//                                    trackRepository.getReferenceById(trackId)
//                            ))
//                            .collect(Collectors.toSet())
//            );
//        }

        return mapper.toDto(playlistRepository.save(playlist));
    }

    @Override
    public PlaylistDto update(Long id, PlaylistDto dto) {

        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new PlaylistNotFoundException(id));

        mapper.updateEntity(dto, playlist);

        if (dto.getUserId() != null) {
            playlist.setUser(userRepository.getReferenceById(dto.getUserId()));
        }

//        if (dto.getTrackIds() != null) {
//
//            playlist.getTrackPlaylists().clear();
//
//            Set<TrackPlaylist> tracks = dto.getTrackIds().stream()
//                    .map(trackId -> new TrackPlaylist(
//                            new TrackPlaylistPK(id, trackId),
//                            playlist,
//                            trackRepository.getReferenceById(trackId)
//                    ))
//                    .collect(Collectors.toSet());
//
//            playlist.getTrackPlaylists().addAll(tracks);
//        }

        return mapper.toDto(playlistRepository.save(playlist));
    }

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


}