package com.floware.musicman.controller;

import com.floware.musicman.service.UserSessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserSessionService userSessionService;

    public UserController(UserSessionService userSessionService) {
        this.userSessionService = userSessionService;
    }

    // Run this method every hour
    @Scheduled(fixedRate = 3600000)
    public void cleanSessions() {
        userSessionService.cleanUpExpiredSessions();
    }

    @GetMapping("/auth-status")
    public ResponseEntity<Map<String, String>> verifyAuthStatus(
            @CookieValue(name = "spotify_session", required = false) String spotifyId) {

        if (spotifyId != null && userSessionService.isValidSession(spotifyId)) {
            return ResponseEntity.ok().body(Map.of(
                    "status", "authenticated",
                    "userId", spotifyId
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
