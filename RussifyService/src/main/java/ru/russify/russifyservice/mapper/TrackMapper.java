package ru.russify.russifyservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.russify.models.TrackDto;
import ru.russify.russifyservice.model.Track;

@Mapper(componentModel = "spring")
public interface TrackMapper {

//    @Mapping(source = "genre.id", target = "genreId")
//    @Mapping(target = "albumIds",
//            expression = "java(entity.getTrackAlbums() == null ? null : " +
//                    "entity.getTrackAlbums().stream()" +
//                    ".map(ta -> ta.getAlbum().getId())" +
//                    ".collect(java.util.stream.Collectors.toSet()))")
//    @Mapping(target = "authorIds",
//            expression = "java(entity.getAuthorTracks() == null ? null : " +
//                    "entity.getAuthorTracks().stream()" +
//                    ".map(at -> at.getAuthor().getId())" +
//                    ".collect(java.util.stream.Collectors.toSet()))")
    TrackDto toDto(Track entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "genre", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "coverHash", ignore = true)
    @Mapping(target = "audioHash", ignore = true)
    @Mapping(target = "trackAlbums", ignore = true)
    @Mapping(target = "authorTracks", ignore = true)
    @Mapping(target = "trackPlaylists", ignore = true)
    @Mapping(target = "favoriteTracks", ignore = true)
    Track toEntity(TrackDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "genre", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "coverHash", ignore = true)
    @Mapping(target = "audioHash", ignore = true)
    @Mapping(target = "trackAlbums", ignore = true)
    @Mapping(target = "authorTracks", ignore = true)
    @Mapping(target = "trackPlaylists", ignore = true)
    @Mapping(target = "favoriteTracks", ignore = true)
    void updateEntity(TrackDto dto, @MappingTarget Track track);
}