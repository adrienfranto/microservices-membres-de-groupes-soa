package com.techie.microservices.api_gateway.routes;

import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class Routes {

    @Bean
    public RouterFunction<ServerResponse> etudiantServiceRoute(){
        return GatewayRouterFunctions.route("etudiant_service")
                .route(RequestPredicates.path("/api/etudiants/**"), HandlerFunctions.http("http://etudiant-service:8080"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> orderServiceRoute(){
        return GatewayRouterFunctions.route("travail_service")
                .route(RequestPredicates.path("/api/travail/**"),HandlerFunctions.http("http://travail-service:8081"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> inventoryRoute(){
        return GatewayRouterFunctions.route("groupe_service")
                .route(RequestPredicates.path("/api/groupes/**"),HandlerFunctions.http("http://groupe-service:8082"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> healthRoute(){
        return GatewayRouterFunctions.route("health")
                .route(RequestPredicates.path("/"), request -> ServerResponse.ok().body("OK"))
                .build();
    }
}
