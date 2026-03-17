package ru.russify.russifyservice.service.interfaces;

import ru.russify.models.TrackDto;
import ru.russify.models.response.UserProfileResponse;
import ru.russify.models.response.UserSettingsResponse;

import java.util.List;

public interface UserService {

    UserProfileResponse getProfile(String email);

    UserSettingsResponse getSettings(String email);


//    TrackDto create(TrackDto album);
//
//    TrackDto update(Long id, TrackDto album);
//
//    List<TrackDto> findAll();
//
//    TrackDto findById(Long id);
//
//    void deleteById(Long id);
}
