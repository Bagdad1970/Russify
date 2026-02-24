package ru.russify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.russify.dto.AlbumDto;
import ru.russify.model.Album;

@Mapper(componentModel = "spring",
        builder = @org.mapstruct.Builder(disableBuilder = true))
public interface AlbumMapper {

    @Mapping(source = "title", target = "name")
    @Mapping(source = "albumType", target = "type")
    @Mapping(target = "trackIds",
            expression = "java(entity.getTrackAlbums() == null ? null : " +
                    "entity.getTrackAlbums().stream()" +
                    ".map(ta -> ta.getTrack().getId())" +
                    ".collect(java.util.stream.Collectors.toSet()))")
    @Mapping(target = "authorIds",
            expression = "java(entity.getAuthorAlbums() == null ? null : " +
                    "entity.getAuthorAlbums().stream()" +
                    ".map(aa -> aa.getAuthor().getId())" +
                    ".collect(java.util.stream.Collectors.toSet()))")
    AlbumDto toDto(Album entity);


    @Mapping(source = "name", target = "title")
    @Mapping(source = "type", target = "albumType")
    @Mapping(target = "trackAlbums", ignore = true)
    @Mapping(target = "authorAlbums", ignore = true)
    @Mapping(target = "favouriteAlbums", ignore = true)
    Album toEntity(AlbumDto dto);
}