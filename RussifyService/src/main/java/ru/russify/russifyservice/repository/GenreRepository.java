package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.russifyservice.model.Genre;

public interface GenreRepository extends JpaRepository<Genre, Long> {

}
