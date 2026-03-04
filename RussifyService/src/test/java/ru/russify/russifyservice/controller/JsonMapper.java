package ru.russify.russifyservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

public class JsonMapper {

    public static String asJsonString(final Object obj) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
            return objectMapper.writeValueAsString(obj);
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
