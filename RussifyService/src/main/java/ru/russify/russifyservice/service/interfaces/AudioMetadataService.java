package ru.russify.russifyservice.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface AudioMetadataService {
    public int extractDurationSeconds(MultipartFile file);
}
