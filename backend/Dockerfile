FROM gradle:8.6-jdk21-alpine AS builder

WORKDIR /app

COPY build.gradle .
COPY settings.gradle .
COPY gradle.properties .
COPY src ./src

RUN gradle build --no-daemon \
    -PSPOTIFY_CLIENT_ID=$SPOTIFY_CLIENT_ID \
    -PSPOTIFY_CLIENT_SECRET=$SPOTIFY_CLIENT_SECRET \
    -PSPOTIFY_REDIRECT_URI=$SPOTIFY_REDIRECT_URI

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=9090

ENV SPOTIFY_CLIENT_ID=""
ENV SPOTIFY_CLIENT_SECRET=""
ENV SPOTIFY_REDIRECT_URI=""

EXPOSE 9090

ENTRYPOINT ["sh", "-c", "java -jar app.jar"]