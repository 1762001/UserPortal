# ----------- Stage 1: Build (optional but best practice) -----------
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests


# ----------- Stage 2: Run (lightweight image) ----------------------
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy only the JAR from build stage
COPY --from=build /build/target/*.jar app.jar

# Expose Spring Boot port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java","-jar","app.jar"]
