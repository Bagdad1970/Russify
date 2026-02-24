package ru.russify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.russify.dto.AlbumDto;
import ru.russify.model.Album;

import java.util.List;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    @Query("""
            select new ru.russify.dto.AlbumDto(
                a.id,
                a.title,
                at.name,
                a.releasedAt
            )
            from Album a
            join a.albumType at
            """)
    List<AlbumDto> findAllAlbumsDto();
}