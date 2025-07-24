package com.floware.musicman.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.core.env.Environment;
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
    private final Environment env;

    private static final String SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

    private final String CLIENT_ID;
    private final String CLIENT_SECRET;

    public UserSessionService(Environment env) {
        this.env = env;
        this.CLIENT_ID = env.getProperty("SPOTIFY_CLIENT_ID");
        this.CLIENT_SECRET = env.getProperty("SPOTIFY_CLIENT_SECRET");

        System.out.println("SPOTIFY_CLIENT_ID: " + CLIENT_ID);
        System.out.println("SPOTIFY_CLIENT_SECRET: " + (CLIENT_SECRET != null ? "[PROVIDED]" : "[NOT SET]"));
    }



    public void storeUserSession(String spotifyId, String accessToken,
                                 String refreshToken, Instant expiresAt) {
        System.out.println("[STORE] Storing session for user: " + spotifyId);
        System.out.println("[STORE] Access token expires at: " + expiresAt);
        activeSessions.put(spotifyId, new UserSession(accessToken, refreshToken, expiresAt));
    }

    public String getAccessToken(String spotifyId) {
        UserSession session = activeSessions.get(spotifyId);
        if (session == null) {
            System.out.println("[GET] No session found for user: " + spotifyId);
            throw new IllegalStateException("Session not found");
        }

        System.out.println("[GET] Checking access token for user: " + spotifyId);
        System.out.println("[GET] Current time: " + Instant.now());
        System.out.println("[GET] Token expires at: " + session.getExpiresAt());

        if (session.isExpired() || Instant.now().plusSeconds(60).isAfter(session.getExpiresAt())) {
            System.out.println("[GET] Token expired or expiring soon. Refreshing...");
            try {
                UserSession refreshedSession = refreshToken(session.getRefreshToken());
                activeSessions.put(spotifyId, refreshedSession);
                System.out.println("[GET] Token successfully refreshed.");
                return refreshedSession.getAccessToken();
            } catch (Exception e) {
                System.out.println("[GET] Token refresh failed for user: " + spotifyId);
                System.out.println("[GET] Error: " + e.getMessage());
                activeSessions.remove(spotifyId);
                throw new IllegalStateException("Failed to refresh token: " + e.getMessage());
            }
        }

        System.out.println("[GET] Token is still valid.");
        return session.getAccessToken();
    }

    private UserSession refreshToken(String refreshToken) {
        System.out.println("[REFRESH] Refreshing token with refresh_token: " + refreshToken);

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

            System.out.println("[REFRESH] New token received. Expires at: " + expiresAt);

            return new UserSession(
                    tokenResponse.getAccess_token(),
                    refreshToken, // Spotify may not return a new refresh token
                    expiresAt
            );
        } else {
            System.out.println("[REFRESH] Failed to refresh token. Status: " + response.getStatusCode());
            throw new IllegalStateException("Failed to refresh token");
        }
    }

    public boolean isValidSession(String spotifyId) {
        if (spotifyId == null) {
            return false;
        }
        UserSession session = activeSessions.get(spotifyId);
        boolean valid = session != null && (!session.isExpired() || session.getRefreshToken() != null);
        System.out.println("[VALIDATE] Session for " + spotifyId + " is " + (valid ? "valid" : "invalid"));
        return valid;
    }

    public void clearUserSession(String spotifyId) {
        if (spotifyId != null) {
            System.out.println("[CLEAR] Clearing session for user: " + spotifyId);
            activeSessions.remove(spotifyId);
        }
    }

    public void cleanUpExpiredSessions() {
        System.out.println("[CLEANUP] Checking for expired sessions to clean up...");
        activeSessions.entrySet().removeIf(entry -> {
            boolean expired = entry.getValue().isExpired();
            boolean refreshable = isRefreshable(entry.getValue().getRefreshToken());
            if (expired && !refreshable) {
                System.out.println("[CLEANUP] Removing expired and unrefreshable session for user: " + entry.getKey());
                return true;
            }
            return false;
        });
    }

    private boolean isRefreshable(String refreshToken) {
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
