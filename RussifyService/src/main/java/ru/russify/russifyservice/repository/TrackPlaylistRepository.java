package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.russifyservice.model.TrackPlaylist;
import ru.russify.russifyservice.model.compositekey.TrackPlaylistPK;

public interface TrackPlaylistRepository extends JpaRepository<TrackPlaylist, TrackPlaylistPK> {

    boolean existsByPlaylistIdAndTrackId(Long playlistId, Long trackId);

    void deleteByPlaylistIdAndTrackId(Long playlistId, Long trackId);
}
