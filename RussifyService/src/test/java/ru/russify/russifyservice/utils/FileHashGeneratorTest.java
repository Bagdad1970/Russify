package ru.russify.russifyservice.utils;

import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class FileHashGeneratorTest {

    private InputStream getFileInputStream(String relativePath) throws IOException {
        String resourcePath = relativePath.replace("src/test/resources/", "");

        ClassLoader classLoader = FileHashGeneratorTest.class.getClassLoader();
        File file = new File(classLoader.getResource(resourcePath).getFile());

        return new FileInputStream(file);
    }

    @Test
    void Generating_hash_for_same_files_must_return_the_same_value() throws IOException {
        String filepath = "src/test/resources/files/photo_for_testing.jpeg";

        try (InputStream inputStream1 = getFileInputStream(filepath); InputStream inputStream2 = getFileInputStream(filepath)) {
            String hash1 = FileHashGenerator.generateFileHash(inputStream1);
            String hash2 = FileHashGenerator.generateFileHash(inputStream2);

            assertThat(hash1).isNotNull();
            assertThat(hash2).isNotNull();
            assertThat(hash1).isEqualTo(hash2);
            assertThat(hash1).hasSize(64);
        }
    }

    @Test
    void Generating_hash_for_different_files_must_return_different_values() throws IOException {
        String filepath1 = "src/test/resources/files/music_for_testing.mp3";
        String filepath2 = "src/test/resources/files/photo_for_testing.jpeg";

        try (InputStream inputStream1 = getFileInputStream(filepath1); InputStream inputStream2 = getFileInputStream(filepath2)) {
            String hash1 = FileHashGenerator.generateFileHash(inputStream1);
            String hash2 = FileHashGenerator.generateFileHash(inputStream2);

            assertThat(hash1).isNotNull();
            assertThat(hash2).isNotNull();
            assertThat(hash1).hasSize(64);
            assertThat(hash2).hasSize(64);
            assertThat(hash1).isNotEqualTo(hash2);
        }
    }

}
