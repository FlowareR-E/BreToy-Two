package com.floware.musicman.controller;

import com.floware.musicman.dto.ArtistDTO;
import com.floware.musicman.model.UserProfile;
import com.floware.musicman.service.SpotifyService;
import com.floware.musicman.service.UserSessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SpotifyControllerTest {

    @Mock
    private SpotifyService spotifyService;

    @Mock
    private UserSessionService userSessionService;

    @Mock
    private OAuth2User principal;

    @InjectMocks
    private SpotifyController spotifyController;

    private static final String SPOTIFY_ID = "spotify123";
    private static final String ACCESS_TOKEN = "access_token_123";
    private static final String ARTIST_ID = "artist123";
    private static final String ALBUM_ID = "album123";

    @BeforeEach
    void setUp() {

    }

    @Test
    void getCurrentUser_Success() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(principal.getAttribute("display_name")).thenReturn("Test User");
        when(principal.getAttribute("email")).thenReturn("test@example.com");
        when(principal.getAttribute("images")).thenReturn(Arrays.asList(
                Map.of("url", "https://example.com/image.jpg")
        ));

        ResponseEntity<UserProfile> response = spotifyController.getCurrentUser(principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(SPOTIFY_ID, response.getBody().getSpotifyId());
        assertEquals("Test User", response.getBody().getDisplayName());
        assertEquals("test@example.com", response.getBody().getEmail());
        assertEquals("https://example.com/image.jpg", response.getBody().getImageUrl());
    }

    @Test
    void getCurrentUser_Exception() {
        when(principal.getAttribute("id")).thenThrow(new RuntimeException("Error getting user id"));

        ResponseEntity<UserProfile> response = spotifyController.getCurrentUser(principal);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void getTopArtists_Success() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        List<ArtistDTO> expectedArtists = Arrays.asList(
                createArtistDTO("1", "Artist One", "Pop"),
                createArtistDTO("2", "Artist Two", "Rock")
        );
        when(spotifyService.getTopArtists(ACCESS_TOKEN)).thenReturn(expectedArtists);

        ResponseEntity<List<ArtistDTO>> response = spotifyController.getTopArtists(principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedArtists, response.getBody());
        verify(userSessionService).getAccessToken(SPOTIFY_ID);
        verify(spotifyService).getTopArtists(ACCESS_TOKEN);
    }

    @Test
    void getTopArtists_IllegalStateException() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID))
                .thenThrow(new IllegalStateException("Session expired"));

        ResponseEntity<List<ArtistDTO>> response = spotifyController.getTopArtists(principal);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
        verify(spotifyService, never()).getTopArtists(anyString());
    }

    @Test
    void getTopArtists_GeneralException() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        when(spotifyService.getTopArtists(ACCESS_TOKEN))
                .thenThrow(new RuntimeException("Service error"));

        ResponseEntity<List<ArtistDTO>> response = spotifyController.getTopArtists(principal);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void getArtist_Success() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        String expectedArtistJson = "{\"id\":\"" + ARTIST_ID + "\",\"name\":\"Test Artist\"}";
        when(spotifyService.getArtistById(ARTIST_ID, ACCESS_TOKEN)).thenReturn(expectedArtistJson);

        ResponseEntity<String> response = spotifyController.getArtist(ARTIST_ID, principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedArtistJson, response.getBody());
        verify(spotifyService).getArtistById(ARTIST_ID, ACCESS_TOKEN);
    }

    @Test
    void getArtist_IllegalStateException() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID))
                .thenThrow(new IllegalStateException("Session expired"));

        ResponseEntity<String> response = spotifyController.getArtist(ARTIST_ID, principal);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Session expired. Please reauthenticate.", response.getBody());
    }

    @Test
    void getArtist_GeneralException() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        when(spotifyService.getArtistById(ARTIST_ID, ACCESS_TOKEN))
                .thenThrow(new RuntimeException("Service error"));

        ResponseEntity<String> response = spotifyController.getArtist(ARTIST_ID, principal);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains("Error processing request"));
    }

    @Test
    void getArtistTopTracks_Success() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        String expectedTracksJson = "{\"tracks\":[{\"id\":\"track1\",\"name\":\"Track One\"}]}";
        when(spotifyService.getArtistTopTracks(ARTIST_ID, ACCESS_TOKEN)).thenReturn(expectedTracksJson);

        ResponseEntity<String> response = spotifyController.getArtistTopTracks(ARTIST_ID, principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedTracksJson, response.getBody());
        verify(spotifyService).getArtistTopTracks(ARTIST_ID, ACCESS_TOKEN);
    }

    @Test
    void getArtistTopTracks_Exception() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        when(spotifyService.getArtistTopTracks(ARTIST_ID, ACCESS_TOKEN))
                .thenThrow(new RuntimeException("Service error"));

        ResponseEntity<String> response = spotifyController.getArtistTopTracks(ARTIST_ID, principal);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains("Error processing request"));
    }

    @Test
    void getArtistAlbums_Success() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        String expectedAlbumsJson = "{\"albums\":[{\"id\":\"album1\",\"name\":\"Album One\"}]}";
        when(spotifyService.getArtistAlbums(ARTIST_ID, ACCESS_TOKEN)).thenReturn(expectedAlbumsJson);

        ResponseEntity<String> response = spotifyController.getArtistAlbums(ARTIST_ID, principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedAlbumsJson, response.getBody());
        verify(spotifyService).getArtistAlbums(ARTIST_ID, ACCESS_TOKEN);
    }

    @Test
    void getArtistAlbums_Exception() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        when(spotifyService.getArtistAlbums(ARTIST_ID, ACCESS_TOKEN))
                .thenThrow(new RuntimeException("Service error"));

        ResponseEntity<String> response = spotifyController.getArtistAlbums(ARTIST_ID, principal);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains("Error processing request"));
    }

    @Test
    void getAlbum_Success() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        String expectedAlbumJson = "{\"id\":\"" + ALBUM_ID + "\",\"name\":\"Test Album\"}";
        when(spotifyService.getAlbumById(ALBUM_ID, ACCESS_TOKEN)).thenReturn(expectedAlbumJson);

        ResponseEntity<String> response = spotifyController.getAlbum(ALBUM_ID, principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedAlbumJson, response.getBody());
        verify(spotifyService).getAlbumById(ALBUM_ID, ACCESS_TOKEN);
    }

    @Test
    void getAlbum_Exception() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        when(spotifyService.getAlbumById(ALBUM_ID, ACCESS_TOKEN))
                .thenThrow(new RuntimeException("Service error"));

        ResponseEntity<String> response = spotifyController.getAlbum(ALBUM_ID, principal);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().contains("Error processing request"));
    }

    @Test
    void search_Success_DefaultTypes() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        String query = "test query";
        String expectedSearchResult = "{\"artists\":{},\"albums\":{},\"tracks\":{}}";
        when(spotifyService.searchSpotify(eq(query), eq("album,artist,track"), eq(ACCESS_TOKEN)))
                .thenReturn(expectedSearchResult);

        ResponseEntity<String> response = spotifyController.search(query, "album,artist,track", principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSearchResult, response.getBody());
        verify(spotifyService).searchSpotify(query, "album,artist,track", ACCESS_TOKEN);
    }

    @Test
    void search_Success_CustomTypes() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        String query = "test query";
        String type = "artist,track";
        String expectedSearchResult = "{\"artists\":{},\"tracks\":{}}";
        when(spotifyService.searchSpotify(eq(query), eq(type), eq(ACCESS_TOKEN)))
                .thenReturn(expectedSearchResult);

        ResponseEntity<String> response = spotifyController.search(query, type, principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSearchResult, response.getBody());
        verify(spotifyService).searchSpotify(query, type, ACCESS_TOKEN);
    }

    @Test
    void search_InvalidTypes_FallbackToDefault() {
        when(principal.getAttribute("id")).thenReturn(SPOTIFY_ID);
        when(userSessionService.getAccessToken(SPOTIFY_ID)).thenReturn(ACCESS_TOKEN);
        String query = "test query";
        String invalidType = "invalid,unknown";
        String expectedSearchResult = "{\"artists\":{},\"albums\":{},\"tracks\":{}}";
        when(spotifyService.searchSpotify(eq(query), eq(invalidType), eq(ACCESS_TOKEN)))
                .thenReturn(expectedSearchResult);

        ResponseEntity<String> response = spotifyController.search(query, invalidType, principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSearchResult, response.getBody());
    }


    // Create ArtistDTO for testing
    private ArtistDTO createArtistDTO(String id, String name, String genre) {
        ArtistDTO artist = new ArtistDTO();
        artist.setId(id);
        artist.setName(name);
        artist.setGenre(genre);
        artist.setPopularity(80);
        artist.setImageUrl("https://example.com/image.jpg");
        return artist;
    }
}