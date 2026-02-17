package ru.russify.repository;

import org.springframework.data.repository.CrudRepository;
import ru.russify.model.AuthorTrack;

public interface AuthorTrackRepository extends CrudRepository<AuthorTrack, Long> {
}
