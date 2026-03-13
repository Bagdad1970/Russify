package ru.russify.russifyservice.controller;

import io.minio.GetObjectResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.russify.models.request.FileGetRequest;
import ru.russify.russifyservice.service.interfaces.FileService;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService service;

    @PostMapping
    public ResponseEntity<InputStreamResource> getFile(@RequestBody FileGetRequest request) {
        try {
            GetObjectResponse objectResponse = service.getObject(request.getBucket(), request.getHash());

            return ResponseEntity.ok()
                    .body(new InputStreamResource(objectResponse));
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
