package com.fitbattle.springboot.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SupabaseJwtDecoder {
    private final String jwtSecret;

    public SupabaseJwtDecoder(@Value("${fitbattle.supabase.jwtSecret:local-development-jwt-secret}") String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    public Claims decode(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
