package ru.russify.russifyservice.service.implementation;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageServiceImpl {

    private final Path storagePath = Paths.get("uploads");

    public String saveFile(MultipartFile file) {

        try{

            if (!Files.exists(storagePath)){
                Files.createDirectories(storagePath);
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path filePath = storagePath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);

            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("File upload error");
        }
    }
}
