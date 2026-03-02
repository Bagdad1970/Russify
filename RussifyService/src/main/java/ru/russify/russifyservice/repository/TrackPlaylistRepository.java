package ru.russify.russifyservice.repository;

import org.springframework.data.repository.CrudRepository;
import ru.russify.russifyservice.model.TrackPlaylist;

public interface TrackPlaylistRepository extends CrudRepository<TrackPlaylist, Long> {
}
