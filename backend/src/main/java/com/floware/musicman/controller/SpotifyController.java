package com.floware.musicman.controller;

import com.floware.musicman.dto.ArtistDTO;
import com.floware.musicman.model.UserProfile;
import com.floware.musicman.service.SpotifyService;
import com.floware.musicman.service.UserSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/spotify")
@RequiredArgsConstructor
public class SpotifyController {

    private final SpotifyService spotifyService;
    private final UserSessionService userSessionService;

    @GetMapping("/me")
    public ResponseEntity<UserProfile> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        try {
            return ResponseEntity.ok(UserProfile.fromOAuth2User(principal));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/me/top/artists")
    public ResponseEntity<List<ArtistDTO>> getTopArtists(@AuthenticationPrincipal OAuth2User principal) {
        try {
            String spotifyId = principal.getAttribute("id");
            String accessToken = userSessionService.getAccessToken(spotifyId);
            List<ArtistDTO> artists = spotifyService.getTopArtists(accessToken);
            return ResponseEntity.ok(artists);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/artists/{id}")
    public ResponseEntity<String> getArtist(@PathVariable String id,
                                            @AuthenticationPrincipal OAuth2User principal) {
        try {
            String spotifyId = principal.getAttribute("id");
            String accessToken = userSessionService.getAccessToken(spotifyId);
            return ResponseEntity.ok(spotifyService.getArtistById(id, accessToken));
        } catch (Exception e) {
            return handleErrorResponse(e);
        }
    }

    @GetMapping("/albums/{id}")
    public ResponseEntity<String> getAlbum(@PathVariable String id,
                                           @AuthenticationPrincipal OAuth2User principal) {
        try {
            String spotifyId = principal.getAttribute("id");
            String accessToken = userSessionService.getAccessToken(spotifyId);
            return ResponseEntity.ok(spotifyService.getAlbumById(id, accessToken));
        } catch (Exception e) {
            return handleErrorResponse(e);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<String> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "album,artist,track") String type,
            @AuthenticationPrincipal OAuth2User principal) {
        try {
            String spotifyId = principal.getAttribute("id");
            String accessToken = userSessionService.getAccessToken(spotifyId);

            // Validate types
            String[] validTypes = {"album", "artist", "track"};
            String[] requestedTypes = type.split(",");
            List<String> filteredTypes = new ArrayList<>();

            for (String t : requestedTypes) {
                if (Arrays.asList(validTypes).contains(t.trim().toLowerCase())) {
                    filteredTypes.add(t.trim().toLowerCase());
                }
            }

            if (filteredTypes.isEmpty()) {
                filteredTypes = Arrays.asList(validTypes);
            }


            return ResponseEntity.ok(spotifyService.searchSpotify(query, type, accessToken));
        } catch (Exception e) {
            return handleErrorResponse(e);
        }
    }

    private ResponseEntity<String> handleErrorResponse(Exception e) {
        if (e instanceof IllegalStateException) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Session expired. Please reauthenticate.");
        }
        return ResponseEntity.internalServerError()
                .body("Error processing request: " + e.getMessage());
    }
}