package ru.russify.russifyservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.russify.models.AlbumDto;
import ru.russify.models.request.CreateAlbumDto;
import ru.russify.russifyservice.model.Album;

@Mapper(componentModel = "spring",
        builder = @org.mapstruct.Builder(disableBuilder = true))
public interface AlbumMapper {

    @Mapping(source = "title", target = "title")
    @Mapping(source = "albumType", target = "type")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "releasedAt", target = "releasedAt")
    @Mapping(source = "coverHash", target = "coverHash")
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


    @Mapping(source = "title", target = "title")
    @Mapping(source = "releasedAt", target = "releasedAt")
    @Mapping(source = "coverHash", target = "coverHash")
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "albumType", ignore = true)
    @Mapping(target = "trackAlbums", ignore = true)
    @Mapping(target = "authorAlbums", ignore = true)
    @Mapping(target = "favouriteAlbums", ignore = true)
    Album toEntity(CreateAlbumDto dto);
}