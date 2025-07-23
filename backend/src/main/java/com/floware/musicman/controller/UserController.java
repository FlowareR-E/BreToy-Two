package com.floware.musicman.controller;

import com.floware.musicman.service.UserSessionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
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

        @GetMapping("/test")
        public String test() {
            return "Backend is reachable!";
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

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = "spotify_session", required = false) String spotifyId,
            HttpServletRequest request,
            HttpServletResponse response) {

        if (spotifyId != null) {
            userSessionService.clearUserSession(spotifyId);

            request.getSession().invalidate();

            ResponseCookie sessionCookie = ResponseCookie.from("spotify_session", "")
                    .httpOnly(false)
                    .secure(false)
                    .sameSite("Lax")
                    .domain("127.0.0.1")
                    .path("/")
                    .maxAge(0)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie.toString());

            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
