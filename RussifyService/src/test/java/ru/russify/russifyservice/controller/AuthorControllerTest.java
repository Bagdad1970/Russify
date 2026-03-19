package ru.russify.russifyservice.controller;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ru.russify.models.AuthorDto;
import ru.russify.models.request.author.CreateAuthorDto;
import ru.russify.models.request.author.UpdateAuthorDto;
import ru.russify.russifyservice.service.implementation.AuthorServiceImpl;

import java.util.List;

import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthorController.class)
public class AuthorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthorServiceImpl service;

    @Test
    void Creating_author_must_create_and_return_it() throws  Exception {
        // arrange
        CreateAuthorDto request = new CreateAuthorDto();
        request.setName("name");
        request.setDescription("description");

        AuthorDto saved = AuthorDto.builder()
                .id(1L)
                .name("author")
                .photoHash("photo_hash")
                .description("description")
                .build();

        Mockito.when(service.create(request))
                .thenReturn(saved);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/authors")
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
    void Updating_author_must_return_updated_author() throws Exception {
        // arrange
        UpdateAuthorDto request = new UpdateAuthorDto();
        request.setName("name1");
        request.setPhotoHash("photo_hash1");
        request.setDescription("description1");

        AuthorDto updated = AuthorDto.builder()
                .id(1L)
                .name("name2")
                .photoHash("photo_hash2")
                .description("description2")
                .build();

        Mockito.when(service.update(1L, request))
                .thenReturn(updated);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .put("/api/authors/1")
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
    void Finding_all_authors_must_return_them() throws Exception {
        // arrange
        AuthorDto author1 = AuthorDto.builder()
                .id(1L)
                .name("name1")
                .photoHash("photo_hash1")
                .description("description1")
                .build();

        AuthorDto author2 = AuthorDto.builder()
                .id(2L)
                .name("name2")
                .photoHash("photo_hash2")
                .description("description2")
                .build();

        List<AuthorDto> authors = List.of(author1, author2);

        Mockito.when(service.findAll())
                .thenReturn(authors);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/authors")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(JsonMapper.asJsonString(authors)));
        Mockito.verify(service, times(1))
                .findAll();
    }

    @Test
    void Finding_existing_author_by_id_must_return_it() throws Exception {
        // arrange
        AuthorDto author = AuthorDto.builder()
                .id(1L)
                .name("author")
                .photoHash("photo_hash")
                .description("description")
                .build();

        Mockito.when(service.findById(1L))
                .thenReturn(author);

        // act & assert
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/authors/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(JsonMapper.asJsonString(author)));
        Mockito.verify(service, times(1))
                .findById(1L);
    }

    @Test
    void Deleting_author_by_id_must_delete_it() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/authors/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isNoContent());
        Mockito.verify(service)
                .deleteById(1L);
    }

}
