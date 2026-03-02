package ru.russify.russifyservice.repository;

import org.springframework.data.repository.CrudRepository;
import ru.russify.russifyservice.model.AuthorTrack;

public interface AuthorTrackRepository extends CrudRepository<AuthorTrack, Long> {
}
