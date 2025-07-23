package com.floware.musicman.config;

import com.floware.musicman.service.UserSessionService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;

@Configuration
public class SecurityConfig {

    private final UserSessionService userSessionService;
    private final OAuth2AuthorizedClientService clientService;

    public SecurityConfig(UserSessionService userSessionService,
                          OAuth2AuthorizedClientService clientService) {
        this.userSessionService = userSessionService;
        this.clientService = clientService;
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.
                cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/spotify/**").authenticated()
                        .anyRequest()
                        .permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oauth2SuccessHandler())
                        .failureHandler((request, response, exception) -> {
                            response.sendRedirect("http://127.0.0.1:8080/login");
                        })
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler(logoutSuccessHandler())
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID", "spotify_session")
                        .addLogoutHandler((request, response, authentication) -> {
                            if (authentication != null && authentication instanceof OAuth2AuthenticationToken) {
                                OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
                                clientService.removeAuthorizedClient(
                                        oauthToken.getAuthorizedClientRegistrationId(),
                                        oauthToken.getName()
                                );
                                userSessionService.clearUserSession(oauthToken.getName());
                            }
                        })
                        .permitAll()
                )
                .csrf(csrf -> csrf.disable());

        return http.build();
    }


    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() {
        return (request, response, authentication) -> {
            ResponseCookie sessionCookie = ResponseCookie.from("spotify_session", "")
                    .httpOnly(false)
                    .secure(false)
                    .sameSite("Lax")
                    .domain("127.0.0.1")
                    .path("/")
                    .maxAge(0)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie.toString());

            String redirectUrl = "https://accounts.spotify.com/logout" +
                    "?continue=" + URLEncoder.encode("http://127.0.0.1:8080/login", StandardCharsets.UTF_8);
            response.sendRedirect(redirectUrl);
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private AuthenticationSuccessHandler oauth2SuccessHandler() {
        return (request, response, authentication) -> {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User principal = oauthToken.getPrincipal();

            OAuth2AuthorizedClient authorizedClient = clientService.loadAuthorizedClient(
                    oauthToken.getAuthorizedClientRegistrationId(),
                    oauthToken.getName()
            );

            if (authorizedClient != null && authorizedClient.getAccessToken() != null) {
                String accessToken = authorizedClient.getAccessToken().getTokenValue();
                Instant expiresAt = authorizedClient.getAccessToken().getExpiresAt();
                String refreshToken = authorizedClient.getRefreshToken() != null
                        ? authorizedClient.getRefreshToken().getTokenValue()
                        : null;

                userSessionService.storeUserSession(
                        principal.getName(),
                        accessToken,
                        refreshToken,
                        expiresAt
                );
                setAuthCookies(response, principal.getName(), accessToken);
            }

            response.sendRedirect("http://127.0.0.1:8080/callback");
        };
    }

    private void setAuthCookies(HttpServletResponse response, String sessionId, String accessToken){
        ResponseCookie sessionCookie = ResponseCookie.from("spotify_session", sessionId)
                .httpOnly(false)
                .secure(false)
                .sameSite("lax")
                .domain("127.0.0.1")
                .path("/")
                .maxAge(Duration.ofDays(30))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie.toString());
    }

}