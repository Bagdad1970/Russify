package ru.russify.repository;

import org.springframework.data.repository.CrudRepository;
import ru.russify.model.AlbumType;

public interface AlbumTypeRepository extends CrudRepository<AlbumType, Long> {
}
