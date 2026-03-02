package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.russify.russifyservice.dto.projection.TrackFlatDto;
import ru.russify.russifyservice.model.Track;

import java.util.List;

public interface TrackRepository extends JpaRepository<Track, Long> {

    /**
     * Мы делаем такой запрос вручную, потому что:
     * Запрос слишком сложный и порождает проблему N+1 (как я понял, так называют нередкую проблему, когда запрос порождает запрос
     * как рекурсия, только в SQL. Это все не точно, но стоит почитать про такой прикол тоже)
     * Здесь же мы сразу джойним таблицы и приводим результат в DTO, что значительно упрощает запрос и оптимизирует работу приложения.
     * Во всяком случае, потом мы сделаем View, которая будет выдавать только то, что мы хотим увидеть (Стандартная View в любой БД)
     * @return
     */
    @Query("""
            select new ru.russify.russifyservice.dto.projection.TrackFlatDto(
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
