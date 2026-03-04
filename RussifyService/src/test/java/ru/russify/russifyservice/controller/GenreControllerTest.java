package ru.russify.russifyservice.controller;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ru.russify.models.GenreDto;
import ru.russify.russifyservice.service.implementation.GenreServiceImpl;

import java.util.List;

import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GenreController.class)
public class GenreControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GenreServiceImpl service;

    @Test
    void Creating_genre_must_create_and_return_it() throws  Exception {
        // arrange
        GenreDto request = new GenreDto();
        request.setName("genre");

        GenreDto saved = GenreDto.builder()
                .id(1L)
                .name("genre")
                .build();

        Mockito.when(service.create(request))
                .thenReturn(saved);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/genres")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(JsonMapper.asJsonString(request))
                )
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(JsonMapper.asJsonString(saved)));
    }

    @Test
    void Updating_genre_must_return_updated_genre() throws Exception {
        // arrange
        GenreDto request = new GenreDto();
        request.setId(1L);
        request.setName("name");

        GenreDto updated = GenreDto.builder()
                .id(1L)
                .name("updated_name")
                .build();

        Mockito.when(service.update(1L, request))
                .thenReturn(updated);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .put("/api/genres/1")
                        .content(JsonMapper.asJsonString(request))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(content().json(JsonMapper.asJsonString(updated)));
    }

    @Test
    void Finding_by_id_existing_genre_must_return_it() throws Exception {
        // arrange
        GenreDto genre = GenreDto.builder()
                .id(1L)
                .name("genre")
                .build();

        Mockito.when(service.findById(1L))
                .thenReturn(genre);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/genres/1")
                        .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(content().json(JsonMapper.asJsonString(genre)));
        Mockito.verify(service, times(1))
                .findById(1L);
    }

    @Test
    void Finding_all_genres_must_return_them() throws Exception {
        // arrange
        GenreDto genre1 = GenreDto.builder()
                .id(1L)
                .name("name1")
                .build();

        GenreDto genre2 = GenreDto.builder()
                .id(2L)
                .name("name2")
                .build();

        List<GenreDto> genres = List.of(genre1, genre2);

        Mockito.when(service.findAll())
                .thenReturn(genres);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/genres")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(JsonMapper.asJsonString(genres)));
        Mockito.verify(service, times(1))
                .findAll();
    }

    @Test
    void Finding_existing_genre_by_id_must_return_it() throws Exception {
        // arrange
        GenreDto genre1 = GenreDto.builder()
                .id(1L)
                .name("name1")
                .build();

        GenreDto genre2 = GenreDto.builder()
                .id(2L)
                .name("name2")
                .build();

        List<GenreDto> genres = List.of(genre1, genre2);

        Mockito.when(service.findAll())
                .thenReturn(genres);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/genres")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(JsonMapper.asJsonString(genres)));
        Mockito.verify(service, times(1))
                .findAll();
    }

    @Test
    void Deleting_author_by_id_must_delete_it() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/genres/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isNoContent());
        Mockito.verify(service)
                .deleteById(1L);
    }
    
}
