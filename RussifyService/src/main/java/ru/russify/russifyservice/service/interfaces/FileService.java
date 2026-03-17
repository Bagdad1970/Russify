package ru.russify.russifyservice.service.interfaces;

import org.springframework.web.multipart.MultipartFile;
import ru.russify.models.response.FileResponseDto;

import java.io.InputStream;

public interface FileService {

    String uploadFile(String bucket, MultipartFile file);

    FileResponseDto generatePreSignUrl(String bucket, String filename);

    InputStream getObject(String bucket, String filename);

    void removeObject(String bucket, String hash);

}
