package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import ru.russify.models.FavouriteTrackDto;
import ru.russify.models.PlaylistTrackDto;
import ru.russify.russifyservice.model.FavouriteTrack;
import ru.russify.russifyservice.model.compositekey.FavouriteTrackPK;

import java.util.List;

public interface FavouriteTrackRepository extends CrudRepository<FavouriteTrack, FavouriteTrackPK> {

    @Query("""
            select new ru.russify.models.FavouriteTrackDto(
                t.id,
                t.name,
                g.id,
                g.name,
                t.coverHash,
                t.audioHash
            )
            from FavouriteTrack ft
            join ft.track t
            join t.genre g
            join ft.user u
            where u.email = :email
    """)
    List<FavouriteTrackDto> findFavouriteTracksByUserEmail(String email);
}