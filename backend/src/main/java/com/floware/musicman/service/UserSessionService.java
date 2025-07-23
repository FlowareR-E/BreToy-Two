package com.floware.musicman.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class UserSessionService {
    private final ConcurrentMap<String, UserSession> activeSessions = new ConcurrentHashMap<>();
    private final RestTemplate restTemplate = new RestTemplate();

    // These should ideally come from configuration
    private static final String SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
    private static final String CLIENT_ID = "your-client-id";
    private static final String CLIENT_SECRET = "your-client-secret";

    public void storeUserSession(String spotifyId, String accessToken,
                                 String refreshToken, Instant expiresAt) {
        activeSessions.put(spotifyId,
                new UserSession(accessToken, refreshToken, expiresAt));
    }

    public String getAccessToken(String spotifyId) {
        UserSession session = activeSessions.get(spotifyId);
        if (session == null) {
            throw new IllegalStateException("Session not found");
        }

        if (session.isExpired() || Instant.now().plusSeconds(60).isAfter(session.getExpiresAt())) {
            try {
                UserSession refreshedSession = refreshToken(session.getRefreshToken());
                activeSessions.put(spotifyId, refreshedSession);
                return refreshedSession.getAccessToken();
            } catch (Exception e) {
                activeSessions.remove(spotifyId);
                throw new IllegalStateException("Failed to refresh token: " + e.getMessage());
            }
        }

        return session.getAccessToken();
    }

    private UserSession refreshToken(String refreshToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(CLIENT_ID, CLIENT_SECRET);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("refresh_token", refreshToken);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<SpotifyTokenResponse> response = restTemplate.exchange(
                SPOTIFY_TOKEN_URL,
                HttpMethod.POST,
                request,
                SpotifyTokenResponse.class
        );

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            SpotifyTokenResponse tokenResponse = response.getBody();
            Instant expiresAt = Instant.now().plusSeconds(tokenResponse.getExpires_in());
            return new UserSession(
                    tokenResponse.getAccess_token(),
                    refreshToken,
                    expiresAt
            );
        } else {
            throw new IllegalStateException("Failed to refresh token");
        }
    }

    public boolean isValidSession(String spotifyId) {
        if (spotifyId == null) {
            return false;
        }
        UserSession session = activeSessions.get(spotifyId);
        return session != null && (!session.isExpired() || session.getRefreshToken() != null);
    }

    public void clearUserSession(String spotifyId) {
        if (spotifyId != null) {
            activeSessions.remove(spotifyId);
        }
    }

    public void cleanUpExpiredSessions() {
        activeSessions.entrySet().removeIf(entry ->
                entry.getValue().isExpired() &&
                        (entry.getValue().getRefreshToken() == null || !isRefreshable(entry.getValue().getRefreshToken()))
        );
    }

    private boolean isRefreshable(String refreshToken) {
        // You might want to add additional checks here
        return refreshToken != null && !refreshToken.isEmpty();
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

    @Getter
    private static class SpotifyTokenResponse {
        private String access_token;
        private String token_type;
        private int expires_in;
        private String refresh_token;
        private String scope;
    }
}