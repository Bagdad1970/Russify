package ru.russify.models.request.author;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateAuthorDto {

    @NotBlank
    private String name;

    private Long userId;

    private MultipartFile photoFile;

    private String description;

}