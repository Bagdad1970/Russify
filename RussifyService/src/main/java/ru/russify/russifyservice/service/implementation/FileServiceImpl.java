package ru.russify.russifyservice.service.implementation;

import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.StatObjectArgs;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.MinioException;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.russify.models.response.FileResponseDto;
import ru.russify.russifyservice.service.interfaces.FileService;
import ru.russify.russifyservice.utils.FileHashGenerator;

import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final MinioClient client;

    private boolean doesObjectExist(String bucket, String filename) {
        try {
            client.statObject(StatObjectArgs.builder()
                            .bucket(bucket)
                            .object(filename)
                    .build());
            return true;
        }
        catch (ErrorResponseException e) {
            return false;
        }
        catch (Exception e) {
            throw new RuntimeException("Unhandled exception " + e.getMessage());
        }
    }

    @Override
    public String uploadFile(String bucket, MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        try {
            InputStream inputStream = file.getInputStream();

            String filename = generateFilename(inputStream, file.getOriginalFilename());

            if (!doesObjectExist(bucket, filename)) {
                client.putObject(PutObjectArgs.builder()
                        .bucket(bucket)
                        .object(filename)
                        .stream(inputStream, inputStream.available(), -1)
                        .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                        .build()
                );
            }

            return filename;
        }
        catch (IOException e) {
            throw new RuntimeException("IOException when saving object" + e.getMessage());
        }
        catch (Exception e) {
            throw new RuntimeException("Exception when saving object" + e.getMessage());
        }
    }

    @Override
    public FileResponseDto generatePreSignUrl(String bucket, String filename) {
        try {
            GetPresignedObjectUrlArgs args = GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET)
                    .bucket(bucket)
                    .object(filename)
                    .expiry(24, TimeUnit.HOURS)
                    .build();

            String url = client.getPresignedObjectUrl(args);

            return FileResponseDto.builder()
                    .filename(filename)
                    .fileUrl(url)
                    .build();
        }
        catch (Exception e) {
            throw new RuntimeException("Exception when generating presigned Url" + e.getMessage());
        }
    }

    @Override
    public InputStream getObject(String bucket, String filename) {
        try {
            return client.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucket)
                            .object(filename)
                            .build()
            );
        }
        catch (MinioException e) {
            System.out.println("Error occurred: " + e);
        }
        catch (Exception e) {
            System.out.println("General Error: " + e.getMessage());
        }
        return null;
    }

    /**
     * Filename is hash of hashed file + its extension.
     * It allows to avoid duplicates when saving files.
     */
    private static String generateFilename(InputStream inputStream, String originalFilename) {
        return FileHashGenerator.generateFileHash(inputStream)
                + "."
                + getExtension(originalFilename);
    }

    private static String getExtension(String originalFilename) {
        return originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
    }

    @Override
    public void removeObject(String bucket, String filename) {
        try {
            client.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(filename)
                    .build());
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to remove file from storage", e);
        }
    }

}
