package ru.russify.russifyservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.russify.models.AlbumDto;
import ru.russify.models.request.CreateAlbumDto;
import ru.russify.russifyservice.model.Album;

@Mapper(
        componentModel = "spring",
        builder = @org.mapstruct.Builder(disableBuilder = true)
)
public interface AlbumMapper {

    @Mapping(source = "albumType", target = "type")
    @Mapping(target = "tracks", ignore = true)
    @Mapping(target = "authors", ignore = true)
    AlbumDto toDto(Album entity);


    @Mapping(source = "title", target = "title")
    @Mapping(source = "releasedAt", target = "releasedAt")
    @Mapping(source = "coverHash", target = "coverHash")

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "albumType", ignore = true)
    @Mapping(target = "trackAlbums", ignore = true)
    @Mapping(target = "authorAlbums", ignore = true)
    @Mapping(target = "favouriteAlbums", ignore = true)

    Album toEntity(CreateAlbumDto dto);
}
