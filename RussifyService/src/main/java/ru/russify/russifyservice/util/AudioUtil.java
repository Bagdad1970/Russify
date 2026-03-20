package ru.russify.russifyservice.util;

import com.mpatric.mp3agic.Mp3File;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

public class AudioUtil {

    public static int getDurationSeconds(MultipartFile file) {

        try {

            File temp = File.createTempFile("track", ".mp3");
            file.transferTo(temp);

            Mp3File mp3 = new Mp3File(temp);

            int duration = (int) mp3.getLengthInSeconds();

            temp.delete();

            return duration;

        } catch (Exception e) {
            throw new RuntimeException("Cannot read audio duration", e);
        }
    }
}