package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.russify.models.AlbumDto;
import ru.russify.models.projection.AlbumFlatDto;
import ru.russify.russifyservice.model.Album;

import java.util.List;

public interface AlbumRepository extends JpaRepository<Album, Long> {

    /*
     * Мы делаем такой запрос вручную, потому что:
     * Запрос слишком сложный и порождает проблему N+1 (как я понял, так называют нередкую проблему, когда запрос порождает запрос
     * как рекурсия, только в SQL. Это все не точно, но стоит почитать про такой прикол тоже)
     * Здесь же мы сразу джойним таблицы и приводим результат в DTO, что значительно упрощает запрос и оптимизирует работу приложения.
     * Во всяком случае, потом мы сделаем View, которая будет выдавать только то, что мы хотим увидеть (Стандартная View в любой БД)
     * @return
     */
    @Query("""
            select new ru.russify.models.AlbumDto(
                a.id,
                a.title,
                at.name,
                a.status,
                a.coverHash,
                a.releasedAt
            )
            from Album a
            join a.albumType at
            """)
    List<AlbumDto> findAllAlbumsDto();

    @Query("""
            select new ru.russify.models.projection.AlbumFlatDto(
                a.id,
            
                t.id,
                t.name,
                g.id,
                g.name,
                t.coverHash,
                t.audioHash,
            
                au.id,
                au.name,
                au.photoHash,
                au.description,
            
                a.title,
                at.name,
                a.releasedAt,
                a.coverHash,
                a.status
            )
            from Album a
            join a.albumType at
            left join a.trackAlbums ta
            left join ta.track t
            left join t.genre g
            left join a.authorAlbums aa
            left join aa.author au
            where a.id = :id
            """)
    List<AlbumFlatDto> findAlbumFlatById(Long id);


    @Query("""
                select new ru.russify.models.AlbumDto(
                    a.id,
                    a.title,
                    at.name,
                    a.status,
                    a.coverHash,
                    a.releasedAt
                )
                from Album a
                join a.albumType at
                join a.authorAlbums aa
                join aa.author au
                join au.user u
                where u.email = :email
            """)
    List<AlbumDto> findAlbumsByAuthorEmail(String email);

}