package ru.russify.russifyservice.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface S3Service {

    String putObject(String bucket, MultipartFile multipartFile);

    void getStreamObject(String bucket, String hash)

    byte[] getFullObject(String bucket, String hash);

    void getFullObjects();

}
