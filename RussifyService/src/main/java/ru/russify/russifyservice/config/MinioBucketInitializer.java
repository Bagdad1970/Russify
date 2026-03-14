package ru.russify.russifyservice.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class MinioBucketInitializer {

    @Value("${s3.minio.buckets}")
    private String[] buckets;

    private final MinioClient minioClient;

    @Bean
    public CommandLineRunner initBuckets() {
        return args -> {
            for (String bucket : buckets) {
                if (!minioClient.bucketExists(BucketExistsArgs.builder()
                        .bucket(bucket)
                        .build())
                ) {
                    minioClient.makeBucket(
                            MakeBucketArgs.builder()
                                    .bucket(bucket)
                                    .build()
                    );
                }
            }
        };
    }

}
