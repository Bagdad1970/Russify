package ru.russify.russifyservice.controller;

import io.minio.GetObjectResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.russify.russifyservice.service.interfaces.FileService;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService service;

    @GetMapping
    public ResponseEntity<InputStreamResource> getFile(
            @RequestParam String bucket,
            @RequestParam String hash
    ) {
        try {
            GetObjectResponse objectResponse = service.getObject(bucket, hash);

            return ResponseEntity.ok()
                    .body(new InputStreamResource(objectResponse));
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
