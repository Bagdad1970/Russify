package ru.russify.repository;

import org.springframework.data.repository.CrudRepository;
import ru.russify.model.FavouriteTrack;

public interface FavouriteTrackRepository extends CrudRepository<FavouriteTrack, Long> {
}
