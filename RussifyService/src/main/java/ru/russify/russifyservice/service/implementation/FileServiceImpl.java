package ru.russify.russifyservice.service.implementation;

import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.russify.russifyservice.service.interfaces.FileService;
import ru.russify.russifyservice.utils.FileHashGenerator;

import java.io.ByteArrayInputStream;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final MinioClient client;

    @Override
    public String putObject(String bucket, MultipartFile multipartFile) {
        // проблема с расширением файла

        try {
            byte[] fileBytes = multipartFile.getBytes();

            String hash = FileHashGenerator.generateFileHash(new ByteArrayInputStream(fileBytes));

            client.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(hash)
                    .stream(new ByteArrayInputStream(fileBytes),
                            fileBytes.length,
                            -1)
                    .contentType(multipartFile.getContentType())
                    .build()
            );

            return hash;
        }
        catch (Exception e) {
            throw new RuntimeException("Unhandled exception when putting object to object storage: " + e.getMessage());
        }
    }

    @Override
    public GetObjectResponse getObject(String bucket, String hash) {
        try {
            return client.getObject(GetObjectArgs.builder()
                    .bucket(bucket)
                    .object(hash)
                    .build());
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to read file from storage", e);
        }
    }

    @Override
    public void removeObject(String bucket, String hash) {
        try {
            client.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(hash)
                    .build());
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to remove file from storage", e);
        }
    }

}
