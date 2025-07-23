FROM gradle:8.6-jdk21-alpine AS builder

WORKDIR /app

COPY build.gradle settings.gradle gradle.properties ./
RUN gradle dependencies --no-daemon  # This caches dependencies

COPY src ./src

ARG SPOTIFY_CLIENT_ID
ARG SPOTIFY_CLIENT_SECRET
ARG SPOTIFY_REDIRECT_URI
RUN gradle build --no-daemon \
    -PSPOTIFY_CLIENT_ID=$SPOTIFY_CLIENT_ID \
    -PSPOTIFY_CLIENT_SECRET=$SPOTIFY_CLIENT_SECRET \
    -PSPOTIFY_REDIRECT_URI=$SPOTIFY_REDIRECT_URI

FROM eclipse-temurin:21-jre-alpine

RUN apk update && apk add --no-cache ca-certificates && update-ca-certificates

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=9090

EXPOSE 9090

ENTRYPOINT ["java", "-jar", "app.jar"]