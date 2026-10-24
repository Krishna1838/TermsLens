# Multi-stage Docker build for TermsLens Unified Application (Root level)
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY backend ./backend
WORKDIR /app/backend
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/backend/target/termslens-backend-1.0.0.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar"]
