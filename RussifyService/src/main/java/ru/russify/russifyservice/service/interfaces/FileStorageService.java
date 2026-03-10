package ru.russify.russifyservice.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String saveFile(MultipartFile file);

}