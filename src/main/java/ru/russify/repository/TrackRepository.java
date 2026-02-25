package ru.russify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.russify.dto.projection.TrackFlatDto;
import ru.russify.model.Track;

import java.util.List;

public interface TrackRepository extends JpaRepository<Track, Long> {
    @Query("""
            select new ru.russify.dto.projection.TrackFlatDto(
                t.id,
                t.name,
                g.id,
                t.coverFilepath,
                t.audioFilepath,
                ta.album.id,
                at.author.id
            )
            from track t
            join t.genre g
            left join t.trackAlbums ta
            left join t.authorTracks at
        """)
    List<TrackFlatDto> findAllFlat();
}
