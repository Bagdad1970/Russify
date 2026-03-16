package ru.russify.russifyservice.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.russify.models.FavouriteTrackDto;
import ru.russify.models.PlaylistTrackDto;
import ru.russify.russifyservice.exception.AlbumAlreadyInFavouritesException;
import ru.russify.russifyservice.exception.AlbumNotFoundException;
import ru.russify.russifyservice.exception.TrackAlreadyInFavouritesException;
import ru.russify.russifyservice.exception.TrackNotFoundException;
import ru.russify.russifyservice.exception.UserNotFoundException;
import ru.russify.russifyservice.model.Album;
import ru.russify.russifyservice.model.FavouriteAlbum;
import ru.russify.russifyservice.model.FavouriteTrack;
import ru.russify.russifyservice.model.Track;
import ru.russify.russifyservice.model.User;
import ru.russify.russifyservice.model.compositekey.FavouriteAlbumPK;
import ru.russify.russifyservice.model.compositekey.FavouriteTrackPK;
import ru.russify.russifyservice.repository.AlbumRepository;
import ru.russify.russifyservice.repository.FavouriteAlbumRepository;
import ru.russify.russifyservice.repository.FavouriteTrackRepository;
import ru.russify.russifyservice.repository.TrackRepository;
import ru.russify.russifyservice.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavouritesServiceImpl {
    private final UserRepository userRepository;
    private final AlbumRepository albumRepository;
    private final FavouriteAlbumRepository favouriteAlbumRepository;
    private final TrackRepository trackRepository;
    private final FavouriteTrackRepository favouriteTrackRepository;

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

    @Transactional
    public void addFavouriteTrack(String email, Long trackId) {

        if (trackId == null) {
            throw new IllegalArgumentException("trackId must not be null");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new TrackNotFoundException(trackId));

        FavouriteTrackPK pk = new FavouriteTrackPK(user.getId(), trackId);

        if (favouriteTrackRepository.existsById(pk)) {
            throw new TrackAlreadyInFavouritesException("Track with id " + trackId + " already exists");
        }

        FavouriteTrack favouriteTrack = FavouriteTrack.builder()
                .id(pk)
                .user(user)
                .track(track)
                .build();

        favouriteTrackRepository.save(favouriteTrack);
    }

    @Transactional(readOnly = true)
    public List<FavouriteTrackDto> getFavouriteTracks(String email) {

        userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        return favouriteTrackRepository.findFavouriteTracksByUserEmail(email);
    }

    @Transactional
    public void deleteTrackFromFavoritesById(String email, Long trackId) {
        if (trackId == null){
            throw new IllegalArgumentException("trackId must not be null");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new TrackNotFoundException(trackId));

        FavouriteTrackPK pk = new FavouriteTrackPK(user.getId(), trackId);

        if (!favouriteTrackRepository.existsById(pk)){
            throw new TrackNotFoundException(trackId);
        }

        favouriteTrackRepository.deleteById(pk);
    }
}
