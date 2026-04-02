# Build Stage
FROM maven:3.9.8-eclipse-temurin-21 AS build

WORKDIR /app

# Copy project files
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/travail-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
