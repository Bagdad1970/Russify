package ru.russify.russifyservice.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.russify.models.AlbumDto;
import ru.russify.models.request.album.AlbumCreateRequest;
import ru.russify.models.request.album.AlbumUpdateRequest;
import ru.russify.models.request.UserSettingsUpdateRequest;
import ru.russify.models.response.UserProfileResponse;
import ru.russify.models.response.UserSettingsResponse;
import ru.russify.russifyservice.service.implementation.AlbumServiceImpl;
import ru.russify.russifyservice.service.interfaces.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;
    private final AlbumServiceImpl albumService;

    @GetMapping("/albums")
    public List<AlbumDto> getUserAlbums(Authentication authentication){

        String email = authentication.getName();

        return albumService.findAlbumsByUser(email);
    }

    @GetMapping("/profile")
    public UserProfileResponse getProfile(Authentication authentication) {

        return userService.getProfile(authentication.getName());
    }

    @PutMapping(
            value = "/albums/{albumId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public AlbumDto updateAlbum(
            @PathVariable Long albumId,
            @ModelAttribute @Valid AlbumUpdateRequest request,
            Authentication authentication
    ) {
        return albumService.updateUserAlbum(
                authentication.getName(),
                albumId,
                request
        );
    }

    @PostMapping(
            value = "/albums",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @ResponseStatus(HttpStatus.CREATED)
    public AlbumDto publishAlbum(
            @ModelAttribute @Valid AlbumCreateRequest request,
            Authentication authentication
    ) {
        return albumService.publishAlbum(authentication.getName(), request);
    }

    @GetMapping("/settings")
    public UserSettingsResponse getSettings(Authentication authentication) {
        return userService.getSettings(authentication.getName());
    }

    @PutMapping("/settings")
    public ResponseEntity<Void> updateSettings(
            @RequestBody UserSettingsUpdateRequest request,
            Authentication authentication
    ) {

        userService.updateSettings(authentication.getName(), request);
        return ResponseEntity.ok().build();
    }
}
