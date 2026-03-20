package ru.russify.models.request.album;


import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class AlbumCreateRequest {

    private String title;

    private MultipartFile coverFile;

    private Long authorId;

    private OffsetDateTime releasedAt;

    private Long typeId;

    private List<String> trackNames;

    private List<Long> trackGenreIds;

    private List<MultipartFile> trackAudioFiles;

    private List<Long> trackAuthorIds;

}