package com.adrienfranto.microservices.etudiant.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Document(value = "etudiant")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Etudiant {
    @Id
    private String id;
    private String matricule;
    private String image;
    private String nom;
    private String prenoms;
    private String sexe;
    private String niveau;
    private Long id_groupe;

}
