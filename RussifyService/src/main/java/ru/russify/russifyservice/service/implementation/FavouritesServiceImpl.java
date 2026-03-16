package ru.russify.russifyservice.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.russify.russifyservice.exception.AlbumAlreadyInFavouritesException;
import ru.russify.russifyservice.exception.AlbumNotFoundException;
import ru.russify.russifyservice.exception.UserNotFoundException;
import ru.russify.russifyservice.model.Album;
import ru.russify.russifyservice.model.FavouriteAlbum;
import ru.russify.russifyservice.model.User;
import ru.russify.russifyservice.model.compositekey.FavouriteAlbumPK;
import ru.russify.russifyservice.repository.AlbumRepository;
import ru.russify.russifyservice.repository.FavouriteAlbumRepository;
import ru.russify.russifyservice.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class FavouritesServiceImpl {
    private final UserRepository userRepository;
    private final AlbumRepository albumRepository;
    private final FavouriteAlbumRepository favouriteAlbumRepository;

    @Transactional
    public void deleteAlbumFromFavoritesById(String email, Long albumId){
        if (albumId == null){
            throw new IllegalArgumentException("albumId must not be null");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new AlbumNotFoundException(albumId));

        FavouriteAlbumPK favouriteAlbumPK = new FavouriteAlbumPK(user.getId(), albumId);

        if (!favouriteAlbumRepository.existsById(favouriteAlbumPK)){
            System.out.println("favoriteAlbumPk = " + favouriteAlbumPK.toString());
            throw new AlbumNotFoundException(albumId);
        }

        favouriteAlbumRepository.deleteById(favouriteAlbumPK);
    }

    @Transactional
    public void addFavouriteAlbum(String email, Long albumId) {

        if (albumId == null) {
            throw new IllegalArgumentException("albumId must not be null");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new AlbumNotFoundException(albumId));

        FavouriteAlbumPK pk = new FavouriteAlbumPK(user.getId(), albumId);

        if (favouriteAlbumRepository.existsById(pk)) {
            throw new AlbumAlreadyInFavouritesException(albumId);
        }

        FavouriteAlbum favourite = FavouriteAlbum.builder()
                .id(pk)
                .user(user)
                .album(album)
                .build();

        favouriteAlbumRepository.save(favourite);
    }
}
