package ru.russify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.model.Playlist;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
}
