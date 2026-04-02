package com.adrienfranto.microservices.travail_service.repository;

import com.adrienfranto.microservices.travail_service.model.Travail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravailRepository extends JpaRepository<Travail,Long> {
}
