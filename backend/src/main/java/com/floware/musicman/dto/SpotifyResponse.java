package com.floware.musicman.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

// Separate class for the Spotify response wrapper
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SpotifyResponse<T> {
    private List<T> items;
    private String href;
    private Integer limit;
    private String next;
    private Integer offset;
    private String previous;
    private Integer total;
}
