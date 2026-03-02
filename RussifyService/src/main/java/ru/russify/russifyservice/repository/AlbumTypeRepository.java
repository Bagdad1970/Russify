package ru.russify.russifyservice.repository;

import org.springframework.data.repository.CrudRepository;
import ru.russify.russifyservice.model.AlbumType;

public interface AlbumTypeRepository extends CrudRepository<AlbumType, Long> {
}
