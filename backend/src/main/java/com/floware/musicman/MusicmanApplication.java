package com.floware.musicman;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class MusicmanApplication {
	public static void main(String[] args) {
		SpringApplication.run(MusicmanApplication.class, args);
	}

	@Bean
	public CommandLineRunner checkVars(Environment env) {
		return args -> {
			System.out.println("SPOTIFY_CLIENT_ID: " + env.getProperty("SPOTIFY_CLIENT_ID"));
			System.out.println("SPOTIFY_REDIRECT_URI: " + env.getProperty("SPOTIFY_REDIRECT_URI"));
		};
	}
}