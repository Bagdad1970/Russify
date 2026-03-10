package ru.russify.russifyservice.service.implementation;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.russify.russifyservice.service.interfaces.FileStorageService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path storagePath = Paths.get("uploads");

    public String saveFile(MultipartFile file) {

        try{

            if (!Files.exists(storagePath)){
                Files.createDirectories(storagePath);
            }

            String extension = file.getOriginalFilename()
                    .substring(file.getOriginalFilename().lastIndexOf("."));

            String fileName = UUID.randomUUID() + extension;

            Path filePath = storagePath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("File upload error");
        }
    }
}
