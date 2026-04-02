# -------------------------------
# Étape 1 : build avec Maven et JDK
# -------------------------------
FROM maven:3.9.8-eclipse-temurin-21 AS build

WORKDIR /app

# Copier pom.xml d'abord pour le cache des dépendances
COPY pom.xml ./
RUN mvn dependency:resolve

# Copier le code source
COPY src ./src

# Compiler le projet et générer le JAR (skip tests pour gagner du temps)
RUN mvn clean package -DskipTests

# -------------------------------
# Étape 2 : image runtime légère
# -------------------------------
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copier le JAR généré depuis l'étape de build
COPY --from=build /app/target/groupe-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java","-jar","app.jar"]
