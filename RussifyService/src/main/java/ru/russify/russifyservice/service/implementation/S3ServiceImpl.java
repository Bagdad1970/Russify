package ru.russify.russifyservice.service.implementation;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.russify.russifyservice.service.interfaces.S3Service;
import ru.russify.russifyservice.utils.FileHashGenerator;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

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
    public byte[] getFullObject(String bucket, String hash) {
        try (InputStream inputStream = client.getObject(GetObjectArgs.builder()
                        .bucket(bucket)
                        .object(hash)

                .build())
        ) {
            return inputStream.readAllBytes();
        } catch (Exception e) {
            throw new RuntimeException("Failed to read file from storage", e);
        }
    }

    @Override
    public void getStreamObject(String bucket, String hash) {
        // возвращает только часть файла.
        // Необходимо для передачи музыки т.к. передавать весь аудиофайл разом неэффективно
    }

    @Override
    public void getFullObjects() {

    }

}
