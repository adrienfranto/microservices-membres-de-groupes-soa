package com.adrienfranto.microservices.travail_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
@Entity
@Table(name = "travail")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Travail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ordreTravail;
    private String nomTravail;
    private String detailTravail;
    private BigDecimal salaire;
    private Integer quantite;
}
