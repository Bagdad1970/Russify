package ru.russify.repository;

import org.springframework.data.repository.CrudRepository;
import ru.russify.model.TrackAlbum;

public interface TrackAlbumRepository extends CrudRepository<TrackAlbum, Long> {
}
