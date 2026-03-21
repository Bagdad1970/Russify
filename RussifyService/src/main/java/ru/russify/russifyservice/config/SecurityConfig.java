package ru.russify.russifyservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
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
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.POST, "/api/tracks/search").permitAll()

                        .requestMatchers("/api/auth/logout").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()
                        .requestMatchers("/api/user/**").authenticated()
                        .requestMatchers("/api/favorites/**").authenticated()
                        .requestMatchers("/api/albums/admin/**").authenticated()
                        .requestMatchers("/api/albums/moderation").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/albums/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/tracks/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/playlists/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/genres/**").authenticated()

                        .requestMatchers(HttpMethod.PUT, "/api/albums/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/tracks/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/playlists/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/genres/**").authenticated()

                        .requestMatchers(HttpMethod.DELETE, "/api/albums/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/tracks/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/playlists/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/genres/**").authenticated()
                        .anyRequest().permitAll()
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable());

        return http.build();
    }
}
