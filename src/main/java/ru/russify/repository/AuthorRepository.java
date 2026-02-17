package ru.russify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.model.Author;

public interface AuthorRepository extends JpaRepository<Author, Long>  {
}
