package ru.russify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.russify.dto.GenreDto;
import ru.russify.model.Genre;

@Mapper(componentModel = "spring")
public interface GenreMapper {

    GenreDto toDto(Genre genre);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tracks", ignore = true)
    Genre toEntity(GenreDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tracks", ignore = true)
    void updateEntity(GenreDto dto, @MappingTarget Genre genre);
}