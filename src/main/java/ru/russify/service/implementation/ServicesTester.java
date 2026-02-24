package ru.russify.service.implementation;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import ru.russify.model.Album;
import ru.russify.model.AlbumType;
import ru.russify.model.Track;
import ru.russify.service.interfaces.AlbumService;
import ru.russify.service.interfaces.AuthorService;
import ru.russify.service.interfaces.GenreService;

/**
 * Тестовый класс для сервисов.
 * Это просто глупость, которую я хотел сделать, но забыл.
 * Как только сделаем тесты для CI/CD, в этом классе не будет смысла.
 */

public class ServicesTester {

    public static void main(String[] args) {
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(ServicesTester.class);

        AlbumService albumService = applicationContext.getBean(AlbumServiceImpl.class);
        AuthorService authorService = applicationContext.getBean(AuthorServiceImpl.class);
        GenreService genreService = applicationContext.getBean(GenreServiceImpl.class);
        PlaylistServiceImpl playlistService = applicationContext.getBean(PlaylistServiceImpl.class);
        RoleServiceImpl roleService = applicationContext.getBean(RoleServiceImpl.class);
        TrackServiceImpl trackService = applicationContext.getBean(TrackServiceImpl.class);

        Track savedTrack = trackService.save(new Track(
                2L,
                "testTrack",
                null,
                "testPath",
                "testPath",
                null,
                null,
                null,
                null)
        );

        Album savedAlbum = albumService.save(new Album(2L, "test album", new AlbumType(), null, null, null, null));

        System.out.println(savedAlbum);
    }
}
