package ru.russify.russifyservice.controller;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ru.russify.models.TrackDto;
import ru.russify.models.request.track.TrackCreateRequest;
import ru.russify.models.request.track.TrackResponse;
import ru.russify.russifyservice.service.implementation.TrackServiceImpl;

import java.util.Set;

import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TrackController.class)
public class TrackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TrackServiceImpl service;

    @Test
    void Creating_track_must_create_and_return_it() throws  Exception {
        // arrange
        TrackCreateRequest request = TrackCreateRequest.builder()
                .name("name")
                .genreId(1L)
                .authorIds(Set.of(1L))
                .albumIds(Set.of(1L))
                .build();

        TrackResponse saved = TrackResponse.builder()
                .id(1L)
                .name("name")
                .genreId(1L)
                .audioHash("audio_hash")
                .coverHash("cover_hash")
                .authorIds(Set.of(1L))
                .albumIds(Set.of(1L))
                .build();

        Mockito.when(service.create(request))
                .thenReturn(saved);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/tracks")
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
    void Updating_track_must_return_updated_track() throws Exception {
        // arrange
        TrackDto request = TrackDto.builder()
                .name("name1")
                .genreId(1L)
                .audioHash("audio_hash1")
                .coverHash("cover_hash1")
                .authorIds(Set.of(1L))
                .albumIds(Set.of(1L))
                .build();

        TrackDto updated = TrackDto.builder()
                .id(1L)
                .name("name1")
                .genreId(1L)
                .audioHash("audio_hash1")
                .coverHash("cover_hash1")
                .authorIds(Set.of(1L))
                .albumIds(Set.of(1L))
                .build();

        Mockito.when(service.update(1L, request))
                .thenReturn(updated);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .put("/api/tracks/1")
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
    void Finding_existing_track_by_id_must_return_it() throws Exception {
        // arrange
        TrackDto track = TrackDto.builder()
                .id(1L)
                .name("name")
                .genreId(1L)
                .audioHash("audio_hash")
                .coverHash("cover_hash")
                .authorIds(Set.of(1L))
                .albumIds(Set.of(1L))
                .build();

        Mockito.when(service.findById(1L))
                .thenReturn(track);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/tracks/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(JsonMapper.asJsonString(track)));
        Mockito.verify(service, times(1))
                .findById(1L);
    }

    @Test
    void Deleting_track_by_id_must_delete_it() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/tracks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isNoContent());
        Mockito.verify(service)
                .deleteById(1L);
    }

}
