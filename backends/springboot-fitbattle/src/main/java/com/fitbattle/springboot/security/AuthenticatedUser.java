package com.fitbattle.springboot.security;

import org.springframework.security.core.Authentication;

public record AuthenticatedUser(String id, String email) implements Authentication {
    @Override
    public String getName() {
        return id;
    }

    @Override
    public java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> getAuthorities() {
        return java.util.List.of();
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getDetails() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return id;
    }

    @Override
    public boolean isAuthenticated() {
        return true;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        if (isAuthenticated) {
            throw new IllegalArgumentException("AuthenticatedUser cannot be re-authenticated");
        }
    }
}
