package ru.russify.russifyservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.russify.models.AuthorDto;
import ru.russify.models.request.CreateAuthorDto;
import ru.russify.models.request.UpdateAuthorDto;
import ru.russify.russifyservice.model.Author;

@Mapper(componentModel = "spring")
public interface AuthorMapper {

    AuthorDto toDto(Author author);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "authorAlbums", ignore = true)
    @Mapping(target = "authorTracks", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "photoHash", ignore = true)
    @Mapping(target = "description", ignore = true)
    @Mapping(target = "user", ignore = true)
    Author toEntity(CreateAuthorDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "authorAlbums", ignore = true)
    @Mapping(target = "authorTracks", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "photoHash", ignore = true)
    @Mapping(target = "description", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateEntity(UpdateAuthorDto dto, @MappingTarget Author author);
}
