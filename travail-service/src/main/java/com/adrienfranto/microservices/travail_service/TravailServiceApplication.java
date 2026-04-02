package com.adrienfranto.microservices.travail_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class TravailServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TravailServiceApplication.class, args);
	}

}
