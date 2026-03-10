package ru.russify.russifyservice.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.russify.models.PlaylistDto;
import ru.russify.models.PlaylistWithTracks;
import ru.russify.models.request.PlaylistCreateRequest;
import ru.russify.models.request.PlaylistUpdateRequest;
import ru.russify.models.response.PlaylistResponse;
import ru.russify.russifyservice.model.User;
import ru.russify.russifyservice.service.implementation.PlaylistServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class PlaylistController {

    private final PlaylistServiceImpl service;

    @GetMapping
    public List<PlaylistDto> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public PlaylistDto findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/{playlist_id}/tracks")
    public PlaylistWithTracks getPlaylist(@PathVariable("playlist_id") Long id) {
        return service.getPlaylistWithTracks(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public PlaylistResponse createPlaylist(
            @ModelAttribute PlaylistCreateRequest request) {
        return service.createPlaylist(request); //исправить - убрать из реквеста айди пользователя
    }

    @PutMapping(
            value = "/{playlistId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public PlaylistDto updatePlaylist(
            @PathVariable Long playlistId,
            @ModelAttribute @Valid PlaylistUpdateRequest request,
            Authentication authentication
    ) {
        return service.update(authentication.getName(), playlistId, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable Long id) {
        service.deleteById(id);
    }
}