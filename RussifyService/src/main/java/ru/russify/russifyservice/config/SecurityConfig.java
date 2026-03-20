package ru.russify.russifyservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import ru.russify.russifyservice.security.JwtAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        //надо залогиниться
                        //POST
                        .requestMatchers("/auth/logout").authenticated()
                        .requestMatchers("/api/user/**").authenticated()
                        .requestMatchers("/api/albums/admin/**").authenticated()
                        .requestMatchers("/api/albums/moderation").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/albums/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/tracks/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/playlists/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/genres/**").authenticated()

                        //PUT
                        .requestMatchers(HttpMethod.PUT, "/api/albums/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/tracks/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/playlists/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/genres/**").authenticated()

                        //DELETE
                        .requestMatchers(HttpMethod.DELETE, "/api/albums/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/tracks/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/playlists/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/genres/**").authenticated()

                        //GET
                        .requestMatchers(HttpMethod.GET, "/auth/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/user/profile").authenticated()

                        // остальные endpoints защищены
                        .anyRequest().permitAll()
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable());

        return http.build();
    }
}
