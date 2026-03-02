package ru.russify.russifyservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.russify.russifyservice.model.Author;

public interface AuthorRepository extends JpaRepository<Author, Long>  {
}
