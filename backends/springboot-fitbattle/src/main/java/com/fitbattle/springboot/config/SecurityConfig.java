package com.fitbattle.springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.fitbattle.springboot.security.SupabaseJwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final SupabaseJwtAuthenticationFilter supabaseJwtAuthenticationFilter;

    public SecurityConfig(SupabaseJwtAuthenticationFilter supabaseJwtAuthenticationFilter) {
        this.supabaseJwtAuthenticationFilter = supabaseJwtAuthenticationFilter;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/health", "/api/v1/health", "/actuator/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/competitions", "/api/v1/competitions/**").permitAll()
                .requestMatchers("/api/v1/leaderboard/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(supabaseJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
