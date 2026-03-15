package ru.russify.models.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import ru.russify.models.AlbumStatus;

import java.time.OffsetDateTime;

@Data
public class AlbumUpdateRequest {

    private String title;

    private MultipartFile coverFile;

    private Long authorId;

    private OffsetDateTime releasedAt;

    private Long typeId;

    private AlbumStatus status;

}