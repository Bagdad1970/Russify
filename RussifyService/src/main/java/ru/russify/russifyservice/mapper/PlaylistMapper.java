package ru.russify.russifyservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.russify.models.PlaylistDto;
import ru.russify.russifyservice.model.Playlist;

@Mapper(componentModel = "spring")
public interface PlaylistMapper {

    @Mapping(source = "user.id", target = "userId")
//    @Mapping(target = "trackIds",
//            expression = "java(entity.getTrackPlaylists() == null ? null : " +
//                    "entity.getTrackPlaylists().stream()" +
//                    ".map(tp -> tp.getTrack().getId())" +
//                    ".collect(java.util.stream.Collectors.toSet()))")
    PlaylistDto toDto(Playlist entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "trackPlaylists", ignore = true)
    Playlist toEntity(PlaylistDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "trackPlaylists", ignore = true)
    void updateEntity(PlaylistDto dto, @MappingTarget Playlist playlist);
}