package ru.russify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.model.Genre;

public interface GenreRepository extends JpaRepository<Genre, Long> {

}
