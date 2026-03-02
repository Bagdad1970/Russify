package ru.russify.russifyservice.repository;

import org.springframework.data.repository.CrudRepository;
import ru.russify.russifyservice.model.FavouriteAlbum;

public interface FavouriteAlbumRepository extends CrudRepository<FavouriteAlbum, Long> {
}
