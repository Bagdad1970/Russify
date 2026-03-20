package ru.russify.russifyservice.service.implementation;

import com.mpatric.mp3agic.Mp3File;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.russify.russifyservice.service.interfaces.AudioMetadataService;

import java.io.File;

@Service
public class AudioMetadataServiceImpl implements AudioMetadataService {
    @SneakyThrows
    public int extractDurationSeconds(MultipartFile file) {

        File temp = File.createTempFile("audio", ".mp3");
        file.transferTo(temp);

        Mp3File mp3 = new Mp3File(temp);

        int duration = (int) mp3.getLengthInSeconds();

        temp.delete();

        return duration;
    }
}
