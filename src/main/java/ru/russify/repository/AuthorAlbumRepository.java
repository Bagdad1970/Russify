package ru.russify.repository;

import org.springframework.data.repository.CrudRepository;
import ru.russify.model.AuthorAlbum;

public interface AuthorAlbumRepository extends CrudRepository<AuthorAlbum, Long> {
}
