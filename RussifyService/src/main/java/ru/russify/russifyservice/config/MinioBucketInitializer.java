package ru.russify.russifyservice.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.SetBucketPolicyArgs;
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
        try {
            return args -> {
                for (String bucket : buckets) {
                    boolean exists = minioClient.bucketExists(
                            BucketExistsArgs.builder()
                                    .bucket(bucket)
                                    .build()
                    );

                    if (!exists) {
                        minioClient.makeBucket(
                                MakeBucketArgs.builder()
                                        .bucket(bucket)
                                        .build()
                        );
                    }

                    setPublicBucketPolicy(bucket);
                }
            };
        }
        catch (Exception e) {
            throw new RuntimeException("Unhandled exception when creating buckets" + e.getMessage());
        }

    }

    private void setPublicBucketPolicy(String bucketName) {
        String policyJson = String.format("""
            {
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Effect": "Allow",
                  "Principal": {"AWS": ["*"]},
                  "Action": ["s3:GetObject"],
                  "Resource": ["arn:aws:s3:::%s/*"]
                }
              ]
            }
            """, bucketName);

        try {
            minioClient.setBucketPolicy(
                    SetBucketPolicyArgs.builder()
                            .bucket(bucketName)
                            .config(policyJson)
                            .build()
            );
        }
        catch (Exception e) {
            throw new RuntimeException("Failed to set public policy for bucket" + e.getMessage());
        }
    }
}