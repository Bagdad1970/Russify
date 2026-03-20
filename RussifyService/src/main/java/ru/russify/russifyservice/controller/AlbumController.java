package ru.russify.russifyservice.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.russify.models.AlbumDto;
import ru.russify.models.request.album.AlbumCreateRequest;
import ru.russify.models.request.album.AlbumUpdateRequest;
import ru.russify.russifyservice.service.implementation.AlbumServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AlbumController {

    private final AlbumServiceImpl service;

    @GetMapping
    public List<AlbumDto> findAll() {
        return service.findPublicWithRelations();
    }

    @GetMapping("/admin/all")
    public List<AlbumDto> findAllManaged(Authentication authentication) {
        return service.findAllManaged(authentication.getName());
    }

    @GetMapping("/moderation")
    public List<AlbumDto> findModerationQueue(Authentication authentication) {
        return service.findModerationQueue(authentication.getName());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AlbumDto createAlbum(
            @ModelAttribute AlbumCreateRequest request,
            Authentication authentication
    ) {
        return service.createAlbum(authentication.getName(), request);
    }

    @GetMapping("/{albumId}")
    public AlbumDto getAlbum(@PathVariable Long albumId, Authentication authentication) {
        return service.getAlbumByIdVisibleTo(
                albumId,
                authentication != null ? authentication.getName() : null
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable Long id, Authentication authentication) {
        service.delete(authentication.getName(), id);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AlbumDto updateAlbum(
            @PathVariable Long id,
            @ModelAttribute AlbumUpdateRequest request,
            Authentication authentication
    ) {
        return service.updateAlbum(authentication.getName(), id, request);
    }
}
