package com.fitbattle.springboot.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class SupabaseJwtAuthenticationFilter extends OncePerRequestFilter {
    private final SupabaseJwtDecoder jwtDecoder;

    public SupabaseJwtAuthenticationFilter(SupabaseJwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            try {
                String token = header.substring(7);
                var claims = jwtDecoder.decode(token);
                String userId = claims.getSubject();
                String email = claims.get("email", String.class);
                SecurityContextHolder.getContext().setAuthentication(new AuthenticatedUser(userId, email));
            } catch (Exception ignored) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
