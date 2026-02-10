package ru.russify.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Тестовый контроллер - просто для проверки сваггера
 */
@RestController
@RequestMapping("api/test")
public class TestController {

    @Operation(summary = "Test endpoint")
    @GetMapping
    public String test(){
        return "Swagger works";
    }
}