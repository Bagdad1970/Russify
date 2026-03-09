package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.russify.models.PlaylistTrackDto;
import ru.russify.models.projection.PlaylistTrackFlatDto;
import ru.russify.russifyservice.model.Playlist;

import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    @Query("""
            select new ru.russify.models.projection.PlaylistTrackFlatDto(
                p.id,
                p.name,
                p.user.id,
                p.isSystem,
                t.id,
                t.name,
                g.id,
                g.name,
                t.coverHash,
                t.audioHash
            )
            from playlist p
            left join p.trackPlaylists tp
            left join tp.track t
            left join t.genre g
            where p.id = :playlistId
            """)
    List<PlaylistTrackFlatDto> findPlaylistWithTracks(Long playlistId);
}
