package com.floware.musicman.model;

import lombok.Data;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.List;
import java.util.Map;

@Data
public class UserProfile {
    private String spotifyId;
    private String displayName;
    private String email;
    private String imageUrl;

    public static UserProfile fromOAuth2User(OAuth2User oauth2User) {
        UserProfile profile = new UserProfile();
        profile.setSpotifyId(oauth2User.getAttribute("id"));
        profile.setDisplayName(oauth2User.getAttribute("display_name"));
        profile.setEmail(oauth2User.getAttribute("email"));

        List<Map<String, Object>> images = oauth2User.getAttribute("images");
        if (images != null && !images.isEmpty()) {
            profile.setImageUrl((String) images.get(0).get("url"));
        }
        return profile;
    }
}