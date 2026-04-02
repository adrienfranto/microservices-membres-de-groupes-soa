package com.adrienfranto.microservices.etudiant.repository;

import com.adrienfranto.microservices.etudiant.model.Etudiant;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EtudiantRepository extends MongoRepository<Etudiant,String> {
}
