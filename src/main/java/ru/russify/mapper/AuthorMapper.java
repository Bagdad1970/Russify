package ru.russify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.russify.dto.AuthorDto;
import ru.russify.dto.request.CreateAuthorDto;
import ru.russify.dto.request.UpdateAuthorDto;
import ru.russify.model.Author;

@Mapper(componentModel = "spring")
public interface AuthorMapper {

    AuthorDto toDto(Author author);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "authorAlbums", ignore = true)
    @Mapping(target = "authorTracks", ignore = true)
    Author toEntity(CreateAuthorDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "authorAlbums", ignore = true)
    @Mapping(target = "authorTracks", ignore = true)
    void updateEntity(UpdateAuthorDto dto, @MappingTarget Author author);
}