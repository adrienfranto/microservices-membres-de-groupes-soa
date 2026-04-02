package com.adrienfranto.microservices.etudiant.dto;

public record EtudiantReponse(String id,String image, String matricule, String nom, String prenoms, String sexe,String niveau,
                               Long id_groupe) {
}
