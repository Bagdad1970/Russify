package ru.russify.russifyservice.service;

import io.minio.BucketExistsArgs;
import io.minio.ListObjectsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.RemoveObjectArgs;
import io.minio.Result;
import io.minio.messages.Bucket;
import io.minio.messages.Item;
import org.apache.commons.compress.utils.IOUtils;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.testcontainers.containers.MinIOContainer;
import ru.russify.russifyservice.service.implementation.FileServiceImpl;
import ru.russify.russifyservice.service.interfaces.FileService;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class FileServiceTest {

    private static String[] buckets = {"photos", "audios"};

    private static FileService fileService;

    private static final MinIOContainer CONTAINER = new MinIOContainer("minio/minio:latest")
            .withUserName("test_user")
            .withPassword("test_password");

    private static MinioClient client;

    @BeforeAll
    static void setUp() {
        CONTAINER.start();

        String url = CONTAINER.getS3URL();

        try {
            client = MinioClient.builder()
                    .endpoint(url)
                    .credentials("test_user", "test_password")
                    .build();

            fileService = new FileServiceImpl(client);

            createBuckets();
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to initialize MinIO client", e);
        }
    }

    static void createBuckets() throws Exception {
        for (String bucket : buckets) {
            if (!client.bucketExists(BucketExistsArgs.builder()
                    .bucket(bucket)
                    .build())
            ) {
                client.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(bucket)
                                .build()
                );
            }
        }
    }

    @AfterEach
    void cleanUpBuckets() {
        try {
            for (Bucket bucket : client.listBuckets()) {
                var items = client.listObjects(ListObjectsArgs.builder()
                        .bucket(bucket.name())
                        .recursive(true)
                        .build());
                for (var item : items) {
                    client.removeObject(RemoveObjectArgs.builder()
                            .bucket(bucket.name())
                            .object(item.get().objectName())
                            .build());
                }
            }
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to clean up MinIO buckets", e);
        }
    }

    @AfterAll
    public static void cleanUp() {
        CONTAINER.close();
    }

    private static int countFilesInBucket(String bucket) {
        int objectCount = 0;
        Iterable<Result<Item>> results = client.listObjects(
                ListObjectsArgs.builder()
                        .bucket(bucket)
                        .recursive(true)
                        .build());

        for (Result<Item> result : results) {
            objectCount++;
        }

        return objectCount;
    }

    private static MultipartFile createMultipartFile(String relativePath, String contentType) throws IOException {
        ClassLoader classLoader = FileServiceTest.class.getClassLoader();

        String resourcePath = relativePath.replace("src/test/resources/", "");

        File file = new File(classLoader.getResource(resourcePath).getFile());
        FileInputStream input = new FileInputStream(file);

        return new MockMultipartFile(
                file.getName(),
                file.getName(),
                contentType,
                IOUtils.toByteArray(input)
        );
    }

    @Test
    void Uploading_file_must_return_not_empty_hash() throws IOException {
        String bucket = "audios";
        MultipartFile multipartFile = createMultipartFile("src/test/resources/files/music_for_testing.mp3", "audio/mpeg");
        int countFilesBefore = countFilesInBucket(bucket);

        String filename = fileService.uploadFile(bucket, multipartFile);
        int countFilesAfter = countFilesInBucket(bucket);

        assertThat(filename).isNotNull();
        assertThat(countFilesAfter).isEqualTo(countFilesBefore + 1);
    }

    @Test
    void Uploading_file_duplicate_must_return_the_same_hash_and_does_not_create_new_file() throws IOException {
        // arrange
        String bucket = "audios";
        MultipartFile multipartFile = createMultipartFile("src/test/resources/files/music_for_testing.mp3", "audio/mpeg");

        String originalFilename = fileService.uploadFile(bucket, multipartFile);
        int countFilesBefore = countFilesInBucket(bucket);

        // act
        String duplicatedFilename = fileService.uploadFile(bucket, multipartFile);
        int countFilesAfter = countFilesInBucket(bucket);

        // assert
        assertThat(duplicatedFilename).isNotNull();
        assertThat(originalFilename).isEqualTo(originalFilename);
        assertThat(countFilesAfter).isEqualTo(countFilesBefore);
    }

    @Test
    void Removing_existing_file_must_remove_it() throws Exception {
        // arrange
        String bucket = "audios";
        MultipartFile multipartFile = createMultipartFile("src/test/resources/files/music_for_testing.mp3", "audio/mpeg");

        String filename = fileService.uploadFile(bucket, multipartFile);
        int countFilesBefore = countFilesInBucket(bucket);

        // act
        fileService.removeObject(bucket, filename);
        int countFilesAfter = countFilesInBucket(bucket);

        // assert
        assertThat(countFilesAfter).isEqualTo(countFilesBefore - 1);
    }

    @Test
    void Removing_not_existing_file_must_do_nothing() {
        String bucket = "photos";
        String filename = "not_existing_filename";
        int countFilesBefore = countFilesInBucket(bucket);

        fileService.removeObject(bucket, filename);

        int countFilesAfter = countFilesInBucket(bucket);
        assertThat(countFilesAfter).isEqualTo(countFilesBefore);
    }

}
