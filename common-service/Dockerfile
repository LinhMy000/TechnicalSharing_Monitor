# --- Stage 1: Build ---
FROM eclipse-temurin:17-jdk AS build
WORKDIR /build

COPY gradle/ gradle/
COPY gradlew gradlew.bat settings.gradle build.gradle ./
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew && ./gradlew dependencies --no-daemon || true
COPY src/ src/
RUN ./gradlew clean build --no-daemon -x test

# --- Stage 2: Runtime ---
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /build/build/libs/*-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]