package com.floware.musicman.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArtistDTO {
    private String id;
    private String name;
    private String imageUrl;
    private int popularity;
    private String genre;

    @JsonProperty("images")
    public void unpackImageUrl(List<Image> images) {
        if (images != null && !images.isEmpty()) {
            this.imageUrl = images.get(0).getUrl();
        }
    }

    @JsonProperty("genres")
    public void unpackGenre(List<String> genres) {
        if (genres != null && !genres.isEmpty()) {
            this.genre = genres.get(0);
        } else {
            this.genre = "Unknown"; // Default value
        }
    }

    @JsonProperty("popularity")
    public void setPopularity(int popularity) {
        this.popularity = popularity;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Image {
        private String url;
        private Integer width;
        private Integer height;
    }
}

