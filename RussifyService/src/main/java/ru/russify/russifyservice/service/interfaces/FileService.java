package ru.russify.russifyservice.service.interfaces;

import io.minio.GetObjectResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    String putObject(String bucket, MultipartFile multipartFile);

    GetObjectResponse getObject(String bucket, String hash);

    void removeObject(String bucket, String hash);

}
