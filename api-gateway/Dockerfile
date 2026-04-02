# Étape 1 : Build avec Maven
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Étape 2 : Image farany ho an'ny app
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copy ny jar avy amin'ny stage builder
COPY --from=builder /app/target/api-gateway-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 9000

# Command to run the app
ENTRYPOINT ["java","-jar","app.jar"]
