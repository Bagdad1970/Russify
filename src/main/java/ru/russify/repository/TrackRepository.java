package ru.russify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.model.Track;

public interface TrackRepository extends JpaRepository<Track, Long> {
}
