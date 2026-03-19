package ru.russify.models.request.track;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrackCreateRequest {

    @NotNull
    private Set<Long> albumIds;

    @NotEmpty
    private Set<Long> authorIds;

    @NotNull
    private MultipartFile audioFile;

    @NotBlank(message = "Track name cannot be empty")
    private String name;

    @NotNull(message = "Genre id is required")
    private Long genreId;

}
