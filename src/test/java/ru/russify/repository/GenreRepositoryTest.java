package ru.russify.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ContextConfiguration;
import org.testcontainers.junit.jupiter.Testcontainers;
import ru.russify.RussifyTestConfiguration;
import ru.russify.model.Genre;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@Testcontainers
@DataJpaTest
@ContextConfiguration(classes = RussifyTestConfiguration.class)
public class GenreRepositoryTest {

    @Autowired
    private GenreRepository repository;

    @Test
    void Saving_genre_must_save_and_return_it() {
        Genre genre = Genre.builder()
                .name("genre")
                .build();

        Genre savedGenre = repository.save(genre);

        Genre expected = Genre.builder()
                .id(1L)
                .name("genre")
                .build();

        assertThat(savedGenre).isEqualTo(expected);

    }

}
