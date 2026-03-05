package ru.russify.russifyservice.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.russify.models.PlaylistDto;
import ru.russify.russifyservice.exception.PlaylistNotFoundException;
import ru.russify.russifyservice.mapper.PlaylistMapper;
import ru.russify.russifyservice.model.Playlist;
import ru.russify.russifyservice.repository.PlaylistRepository;
import ru.russify.russifyservice.repository.TrackRepository;
import ru.russify.russifyservice.repository.UserRepository;
import ru.russify.russifyservice.service.interfaces.PlaylistService;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PlaylistServiceImpl implements PlaylistService {

    private final PlaylistRepository repository;
    private final UserRepository userRepository;
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

        return mapper.toDto(repository.save(playlist));
    }

    @Override
    public PlaylistDto update(Long id, PlaylistDto dto) {

        Playlist playlist = repository.findById(id)
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

        return mapper.toDto(repository.save(playlist));
    }

    @Override
    public List<PlaylistDto> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public PlaylistDto findById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new PlaylistNotFoundException(id));
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}