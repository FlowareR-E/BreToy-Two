package com.floware.musicman.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class UserSessionService {
    private final ConcurrentMap<String, UserSession> activeSessions = new ConcurrentHashMap<>();

    public void storeUserSession(String spotifyId, String accessToken,
                                 String refreshToken, Instant expiresAt) {
        activeSessions.put(spotifyId,
                new UserSession(accessToken, refreshToken, expiresAt));
    }

    public String getAccessToken(String spotifyId) {
        UserSession session = activeSessions.get(spotifyId);
        if (session == null || session.isExpired()) {
            throw new IllegalStateException("Session expired or not found");
        }
        return session.getAccessToken();
    }

    public boolean isValidSession(String spotifyId) {
        if (spotifyId == null) {
            return false;
        }
        UserSession session = activeSessions.get(spotifyId);
        return session != null && !session.isExpired();
    }

    public void clearUserSession(String spotifyId) {
        if (spotifyId != null) {
            activeSessions.remove(spotifyId); // Explicit removal (don't wait for expiration)
        }
    }
    public void cleanUpExpiredSessions() {
        activeSessions.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }

    @Getter
    @AllArgsConstructor
    private static class UserSession {
        private final String accessToken;
        private final String refreshToken;
        private final Instant expiresAt;

        public boolean isExpired() {
            return Instant.now().isAfter(expiresAt);
        }
    }
}
