package ru.russify.russifyservice.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.russify.models.AlbumDto;
import ru.russify.models.request.AddFavouriteAlbumRequest;
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
}
