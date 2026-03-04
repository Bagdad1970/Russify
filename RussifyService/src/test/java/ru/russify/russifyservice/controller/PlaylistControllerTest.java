package ru.russify.russifyservice.controller;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ru.russify.models.PlaylistDto;
import ru.russify.russifyservice.service.implementation.PlaylistServiceImpl;

import java.util.List;
import java.util.Set;

import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PlaylistController.class)
public class PlaylistControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PlaylistServiceImpl service;

    @Test
    void Creating_playlist_must_create_and_return_it() throws  Exception {
        // arrange
        PlaylistDto request = PlaylistDto.builder()
                .name("playlist")
                .userId(1L)
                .isSystem(false)
                .trackIds(Set.of(1L, 2L, 3L))
                .build();

        PlaylistDto saved = PlaylistDto.builder()
                .id(1L)
                .userId(1L)
                .isSystem(false)
                .trackIds(Set.of(1L, 2L, 3L))
                .build();

        Mockito.when(service.create(request))
                .thenReturn(saved);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/playlists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(JsonMapper.asJsonString(request))
                )
                .andExpect(status().isCreated())
                .andExpect(content().json(JsonMapper.asJsonString(saved)));
        Mockito.verify(service, times(1))
                .create(request);
    }

    @Test
    void Updating_playlist_must_return_updated_playlist() throws Exception {
        // arrange
        PlaylistDto request = PlaylistDto.builder()
                .id(1L)
                .name("playlist1")
                .userId(1L)
                .isSystem(false)
                .trackIds(Set.of(1L, 2L, 3L))
                .build();

        PlaylistDto updated = PlaylistDto.builder()
                .id(1L)
                .name("playlist2")
                .userId(1L)
                .isSystem(false)
                .trackIds(Set.of(1L, 2L, 3L, 4L, 5L))
                .build();

        Mockito.when(service.update(1L, request))
                .thenReturn(updated);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .put("/api/playlists/1")
                        .content(JsonMapper.asJsonString(request))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(content().json(JsonMapper.asJsonString(updated)));
        Mockito.verify(service, times(1))
                .update(1L, request);
    }

    @Test
    void Finding_all_playlists_must_return_them() throws Exception {
        // arrange
        PlaylistDto playlist1 = PlaylistDto.builder()
                .id(1L)
                .name("playlist1")
                .userId(1L)
                .isSystem(false)
                .trackIds(Set.of(1L, 2L, 3L))
                .build();

        PlaylistDto playlist2 = PlaylistDto.builder()
                .id(2L)
                .name("playlist2")
                .userId(2L)
                .isSystem(true)
                .trackIds(Set.of(4L, 5L, 6L))
                .build();

        List<PlaylistDto> playlists = List.of(playlist1, playlist2);

        Mockito.when(service.findAll())
                .thenReturn(playlists);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/playlists")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(JsonMapper.asJsonString(playlists)));
        Mockito.verify(service, times(1))
                .findAll();
    }

    @Test
    void Finding_existing_playlist_by_id_must_return_it() throws Exception {
        // arrange
        PlaylistDto author = PlaylistDto.builder()
                .id(1L)
                .name("playlist1")
                .userId(1L)
                .isSystem(false)
                .trackIds(Set.of(1L, 2L, 3L))
                .build();

        Mockito.when(service.findById(1L))
                .thenReturn(author);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/playlists/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(JsonMapper.asJsonString(author)));
        Mockito.verify(service, times(1))
                .findById(1L);
    }

    @Test
    void Deleting_playlist_by_id_must_delete_it() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/playlists/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isNoContent());
        Mockito.verify(service)
                .deleteById(1L);
    }

}
