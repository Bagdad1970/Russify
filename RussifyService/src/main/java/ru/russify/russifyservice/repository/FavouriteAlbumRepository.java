package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.russifyservice.model.FavouriteAlbum;
import ru.russify.russifyservice.model.compositekey.FavouriteAlbumPK;

public interface FavouriteAlbumRepository
        extends JpaRepository<FavouriteAlbum, FavouriteAlbumPK> {

    boolean existsById(FavouriteAlbumPK id);

}