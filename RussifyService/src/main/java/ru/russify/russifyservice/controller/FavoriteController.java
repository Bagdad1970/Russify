package ru.russify.russifyservice.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.russify.models.AlbumDto;
import ru.russify.models.FavouriteTrackDto;
import ru.russify.models.PlaylistDto;
import ru.russify.models.request.AddFavouriteAlbumRequest;
import ru.russify.models.request.AddFavouriteTrackRequest;
import ru.russify.russifyservice.service.implementation.AlbumServiceImpl;
import ru.russify.russifyservice.service.implementation.FavouritesServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class FavoriteController {
    private final AlbumServiceImpl albumService;
    private final FavouritesServiceImpl favouriteService;

    @GetMapping("/albums")
    public List<AlbumDto> getFavouriteAlbums(Authentication authentication) {

        String email = authentication.getName();

        return albumService.getFavouriteAlbums(email);
    }

    @PostMapping("/albums")
    @ResponseStatus(HttpStatus.CREATED)
    public void addFavouriteAlbum(
            @RequestBody AddFavouriteAlbumRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        favouriteService.addFavouriteAlbum(email, request.getAlbumId());
    }

    @DeleteMapping("/albums/{albumId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFavouriteAlbum(Authentication authentication, @PathVariable Long albumId) {
        String email = authentication.getName();

        favouriteService.deleteAlbumFromFavoritesById(email, albumId);
    }

    @PostMapping("/tracks")
    @ResponseStatus(HttpStatus.CREATED)
    public void addFavouriteTrack(
            @RequestBody AddFavouriteTrackRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();

        favouriteService.addFavouriteTrack(email, request.getTrackId());
    }

    @GetMapping("/tracks")
    public List<FavouriteTrackDto> getFavouriteTracks(Authentication authentication) {

        String email = authentication.getName();

        return favouriteService.getFavouriteTracks(email);
    }

    @DeleteMapping("/tracks/{trackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFavouriteTrack(Authentication authentication, @PathVariable Long trackId) {
        String email = authentication.getName();

        favouriteService.deleteTrackFromFavoritesById(email, trackId);
    }

    @GetMapping("/playlists")
    public List<PlaylistDto> getFavouritePlaylists(Authentication authentication) {

        String email = authentication.getName();

        return favouriteService.getFavouritePlaylists(email);
    }

    @PostMapping("/playlists")
    public ResponseEntity<Void> addPlaylistToFavourites(
            @RequestParam Long playlistId,
            Authentication authentication
    ) {

        favouriteService.addPlaylistToFavourites(authentication.getName(), playlistId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
