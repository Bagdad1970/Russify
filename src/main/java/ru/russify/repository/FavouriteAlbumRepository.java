package ru.russify.repository;

import org.springframework.data.repository.CrudRepository;
import ru.russify.model.FavouriteAlbum;

public interface FavouriteAlbumRepository extends CrudRepository<FavouriteAlbum, Long> {
}
