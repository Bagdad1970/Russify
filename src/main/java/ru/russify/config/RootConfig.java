package ru.russify.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.russify.repository.AlbumRepository;
import ru.russify.repository.AuthorRepository;
import ru.russify.repository.GenreRepository;
import ru.russify.repository.PlaylistRepository;
import ru.russify.repository.RoleRepository;
import ru.russify.repository.TrackRepository;
import ru.russify.service.implementation.AlbumServiceImpl;
import ru.russify.service.implementation.AuthorServiceImpl;
import ru.russify.service.implementation.GenreServiceImpl;
import ru.russify.service.implementation.PlaylistServiceImpl;
import ru.russify.service.implementation.RoleServiceImpl;
import ru.russify.service.implementation.TrackServiceImpl;
import ru.russify.service.interfaces.RoleService;
import ru.russify.service.interfaces.TrackService;

/**
 * Пока не используется, но потом будет.
 * Это класс, где пропишем все необходимые бины.
 *
 * Либо мы будем использовать @Autowired аннотации
 */

@Configuration
public class RootConfig {

}
