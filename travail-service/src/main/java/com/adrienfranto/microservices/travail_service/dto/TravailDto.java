package com.adrienfranto.microservices.travail_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TravailDto {

    private Long id;
    private String ordreTravail;
    private String nomTravail;
    private String detailTravail;
    private BigDecimal salaire;
    private Integer quantite;

}
