package ru.russify.repository;

import org.springframework.data.repository.CrudRepository;
import ru.russify.model.TrackPlaylist;

public interface TrackPlaylistRepository extends CrudRepository<TrackPlaylist, Long> {
}
