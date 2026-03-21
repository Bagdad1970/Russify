package ru.russify.russifyservice.service.interfaces;

import ru.russify.models.PlaylistDto;
import ru.russify.models.PlaylistWithTracks;
import ru.russify.models.request.PlaylistCreateRequest;
import ru.russify.models.request.PlaylistUpdateRequest;
import ru.russify.models.response.PlaylistResponse;

import java.util.List;

public interface PlaylistService {

    List<PlaylistDto> findAll();

    PlaylistDto findById(Long id);

    void deleteById(Long id);

    PlaylistWithTracks getPlaylistWithTracks(Long playlistId);

    PlaylistResponse createPlaylist(
            String email,
            PlaylistCreateRequest request
    );

    PlaylistDto update(
            String email,
            Long playlistId,
            PlaylistUpdateRequest request
    );

    void addTrack(
            String email,
            Long playlistId,
            Long trackId
    );

    void removeTrack(
            String email,
            Long playlistId,
            Long trackId
    );

}
