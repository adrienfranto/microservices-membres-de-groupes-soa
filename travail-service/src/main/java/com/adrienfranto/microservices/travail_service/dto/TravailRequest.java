package com.adrienfranto.microservices.travail_service.dto;

import java.math.BigDecimal;

public record TravailRequest (Long id, String ordreTravail, String nomTravail, String detailTravail,
                              BigDecimal salaire, Integer quantite) {
}
