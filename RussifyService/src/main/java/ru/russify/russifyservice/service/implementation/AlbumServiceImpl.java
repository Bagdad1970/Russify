package ru.russify.russifyservice.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.russify.russifyservice.dto.AlbumDto;
import ru.russify.russifyservice.dto.projection.AlbumFlatDto;
import ru.russify.russifyservice.dto.request.CreateAlbumDto;
import ru.russify.russifyservice.dto.request.UpdateAlbumDto;
import ru.russify.russifyservice.exception.AlbumNotFoundException;
import ru.russify.russifyservice.mapper.AlbumMapper;
import ru.russify.russifyservice.model.Album;
import ru.russify.russifyservice.model.AuthorAlbum;
import ru.russify.russifyservice.model.TrackAlbum;
import ru.russify.russifyservice.model.compositekey.AuthorAlbumPK;
import ru.russify.russifyservice.model.compositekey.TrackAlbumPK;
import ru.russify.russifyservice.repository.AlbumRepository;
import ru.russify.russifyservice.repository.AlbumTypeRepository;
import ru.russify.russifyservice.repository.AuthorRepository;
import ru.russify.russifyservice.repository.TrackRepository;
import ru.russify.russifyservice.service.interfaces.AlbumService;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Сервис для управления альбомами.
 * Позволяет сохранять, редактировать, искать и удалять альбомы.
 */

@Service
@RequiredArgsConstructor
public class AlbumServiceImpl implements AlbumService {

    private final AlbumRepository albumRepository;
    private final AlbumTypeRepository albumTypeRepository;
    private final TrackRepository trackRepository;
    private final AuthorRepository authorRepository;
    private final AlbumMapper mapper;

    public List<AlbumDto> findAllWithRelations() {
        return albumRepository.findAllAlbumsDto();
    }

    @Transactional
    public void delete(Long id){
        albumRepository.deleteById(id);
    }

    @Transactional
    public Album create(CreateAlbumDto dto){
        Album album = mapper.toEntity(dto);
        album.setAlbumType(
                albumTypeRepository.findById(dto.getAlbumTypeId())
                        .orElseThrow()
        );

        album.setTrackAlbums(
                dto.getTrackIds().stream()
                        .map(id -> new TrackAlbum(
                                new TrackAlbumPK(id, null),
                                trackRepository.getReferenceById(id),
                                album
                        ))
                        .collect(Collectors.toSet())
        );

        album.setAuthorAlbums(
                dto.getAuthorIds().stream()
                        .map(id -> new AuthorAlbum(
                                new AuthorAlbumPK(id, null),
                                authorRepository.getReferenceById(id),
                                album
                        ))
                        .collect(Collectors.toSet())
        );

        return albumRepository.save(album);
    }

    @Transactional
    public Album update(Long id, UpdateAlbumDto dto) {

        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new AlbumNotFoundException(id));

        album.setTitle(dto.getTitle());
        album.setReleasedAt(dto.getReleasedAt());

        album.setAlbumType(
                albumTypeRepository.findById(dto.getAlbumTypeId())
                        .orElseThrow()
        );

        album.getAuthorAlbums().clear();
        album.getTrackAlbums().clear();

        Set<AuthorAlbum> authors = dto.getAuthorIds().stream()
                .map(authorId -> new AuthorAlbum(
                        new AuthorAlbumPK(authorId, album.getId()),
                        authorRepository.getReferenceById(authorId),
                        album
                ))
                .collect(Collectors.toSet());

        Set<TrackAlbum> tracks = dto.getTrackIds().stream()
                .map(trackId -> new TrackAlbum(
                        new TrackAlbumPK(trackId, album.getId()),
                        trackRepository.getReferenceById(trackId),
                        album
                ))
                .collect(Collectors.toSet());

        album.getAuthorAlbums().addAll(authors);
        album.getTrackAlbums().addAll(tracks);

        return albumRepository.save(album);
    }

    public AlbumDto findDtoById(Long id){
        List<AlbumFlatDto> flatRows = albumRepository.findAlbumFlatById(id);

        if (flatRows.isEmpty()){
            throw new AlbumNotFoundException(id);
        }

        AlbumFlatDto first = flatRows.get(0);

        AlbumDto dto = new AlbumDto(
                first.id(),
                first.title(),
                first.typeName(),
                first.releasedAt()
        );

        dto.setTrackIds(new HashSet<>());
        dto.setAuthorIds(new HashSet<>());

        for (AlbumFlatDto row : flatRows){
            if (row.trackId() != null){
                dto.getTrackIds().add(row.trackId());
            }

            if (row.authorId() != null){
                dto.getAuthorIds().add(row.authorId());
            }
        }

        return dto;
    }

    /**
     * Метод сохранения альбома в бд.
     *
     * @param album - экземпляр класса {@code Album }
     * @return
     */
    @Override
    public Album save(Album album) {
        return albumRepository.save(album);
    }

    @Override
    public Album update(Album album) {
        Album existing = albumRepository.findById(album.getId())
                .orElseThrow(() -> new AlbumNotFoundException(album.getId()));

        if (album.getTitle() != null) existing.setTitle(album.getTitle());
        if (album.getAlbumType() != null) existing.setAlbumType(album.getAlbumType());
        if (album.getReleasedAt() != null) existing.setReleasedAt(album.getReleasedAt());

        return albumRepository.save(existing);
    }

    @Override
    public List<Album> findAll() {
        return albumRepository.findAll();
    }

    @Override
    public Optional<Album> findById(Long id) {
        return albumRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        albumRepository.deleteById(id);
    }
}
