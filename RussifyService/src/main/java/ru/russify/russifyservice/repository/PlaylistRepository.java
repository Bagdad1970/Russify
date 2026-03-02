package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.russifyservice.model.Playlist;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
}
