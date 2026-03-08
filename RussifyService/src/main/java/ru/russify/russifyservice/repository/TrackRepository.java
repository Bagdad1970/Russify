package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import ru.russify.russifyservice.model.Track;


public interface TrackRepository extends JpaRepository<Track, Long>, JpaSpecificationExecutor<Track> {

}
