package com.floware.musicman.service;

import com.floware.musicman.dto.ArtistDTO;
import com.floware.musicman.dto.SpotifyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.oauth2.client.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotifyService {

    private final OAuth2AuthorizedClientManager clientManager;
    private final WebClient webClient = WebClient.create("https://api.spotify.com/v1");


    public List<ArtistDTO> getTopArtists(String accessToken) {

        SpotifyResponse<ArtistDTO> response = webClient.get()
                .uri("/me/top/artists?limit=10")
                .headers(h -> h.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<SpotifyResponse<ArtistDTO>>() {})
                .block();

        return response != null ? response.getItems() : Collections.emptyList();
    }

    public String getArtistById(String id, String accessToken) {
        return webClient.get()
                .uri("/artists/{id}", id)
                .headers(h -> h.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getArtistTopTracks(String id, String accessToken) {
        return webClient.get()
                .uri("/artists/{id}/top-tracks", id)
                .headers(h -> h.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getAlbumById(String id, String accessToken) {
        return webClient.get()
                .uri("/albums/{id}", id)
                .headers(h -> h.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getArtistAlbums(String id, String accessToken) {
        return webClient.get()
                .uri("/artists/{id}/albums", id)
                .headers(h -> h.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String searchSpotify(String query, String type, String accessToken) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("q", query)
                        .queryParam("type", type)
                        .queryParam("limit", 10)
                        .build())
                .headers(h -> h.setBearerAuth(accessToken))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    // Helpers

}
