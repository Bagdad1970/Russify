package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.russify.models.PlaylistDto;
import ru.russify.russifyservice.model.FavouritePlaylist;
import ru.russify.russifyservice.model.compositekey.FavouritePlaylistPK;

import java.util.List;

public interface FavouritePlaylistRepository
        extends JpaRepository<FavouritePlaylist, FavouritePlaylistPK> {

    @Query("""
                select new ru.russify.models.PlaylistDto(
                    p.id,
                    p.name,
                    p.user.id,
                    p.isSystem,
                    p.coverHash
                )
                from favourite_playlist fp
                join fp.playlist p
                join fp.user u
                where u.email = :email
            """)
    List<PlaylistDto> findFavouritePlaylistsByUserEmail(String email);

    boolean existsByUserIdAndPlaylistId(Long userId, Long playlistId);

    void deleteByUserIdAndPlaylistId(Long userId, Long playlistId);
}