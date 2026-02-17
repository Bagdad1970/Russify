package ru.russify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.model.Album;

public interface AlbumRepository extends JpaRepository<Album, Long> {
}
