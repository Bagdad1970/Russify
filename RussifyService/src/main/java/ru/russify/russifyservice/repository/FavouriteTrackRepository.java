package ru.russify.russifyservice.repository;

import org.springframework.data.repository.CrudRepository;
import ru.russify.russifyservice.model.FavouriteTrack;

public interface FavouriteTrackRepository extends CrudRepository<FavouriteTrack, Long> {
}
